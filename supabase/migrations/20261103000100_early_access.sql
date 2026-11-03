-- REVIEW ONLY. Target the dedicated Early Access project avdkvtmugeizoqqvayek.
-- Never apply this file to the game-privileges Supabase project.
-- The Patreon identity is the local supporter principal until an existing auth.users
-- account can be linked through a separately reviewed, explicit linking flow.

-- Fail before touching an existing game schema or Storage bucket. This
-- migration is intentionally single-use and must not adopt similarly named
-- objects whose ownership or policies have not been reviewed.
do $$
declare object_name text;
begin
  -- A fresh Early Access project should have no application-owned public
  -- relations. This guard adds protection against applying to the game DB,
  -- but cannot prove the hosted project ID; verify the CLI target manually.
  if exists (
    select 1 from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relkind in ('r', 'p', 'v', 'm', 'f')
      and not exists (
        select 1 from pg_depend d
        where d.classid = 'pg_class'::regclass and d.objid = c.oid
          and d.deptype = 'e'
      )
  ) then
    raise exception 'Expected a clean dedicated Early Access public schema';
  end if;
  foreach object_name in array array[
    'supporter_accounts', 'supporter_entitlements', 'early_access_releases',
    'download_grants', 'webhook_events', 'supporter_oauth_states',
    'supporter_sessions', 'early_access_rate_limits', 'early_access_audit_events',
    'supporter_accounts_auth_user_idx', 'download_grants_account_issued_idx',
    'download_grants_release_idx', 'supporter_sessions_account_idx',
    'early_access_audit_events_account_idx', 'early_access_audit_events_created_idx'
  ] loop
    if to_regclass(format('public.%I', object_name)) is not null then
      raise exception 'Early Access name conflict: public.%', object_name;
    end if;
  end loop;
  if exists (
    select 1 from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = any (array[
      'consume_supporter_oauth_state', 'consume_early_access_rate_limit',
      'prune_early_access_ephemeral'
    ])
  ) then
    raise exception 'Early Access function name conflict';
  end if;
  if to_regclass('auth.users') is null then
    raise exception 'Required auth.users table is absent';
  end if;
  if not exists (select 1 from pg_roles where rolname = 'anon')
     or not exists (select 1 from pg_roles where rolname = 'authenticated')
     or not exists (
       select 1 from pg_roles where rolname = 'service_role' and rolbypassrls
     ) then
    raise exception 'Required Supabase client roles or service_role BYPASSRLS are absent';
  end if;
  if not exists (
    select 1 from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'storage' and c.relname = 'objects'
      and c.relrowsecurity
  ) then
    raise exception 'Storage objects table is absent or RLS is disabled';
  end if;
  if exists (select 1 from storage.buckets
             where id = 'early-access-builds' or name = 'early-access-builds') then
    raise exception 'Early Access Storage bucket name conflict';
  end if;
  if exists (select 1 from pg_policies where schemaname = 'storage'
      and tablename = 'objects' and policyname = 'early_access_objects_block_clients') then
    raise exception 'Early Access Storage policy name conflict';
  end if;
end $$;

create table public.supporter_accounts (
  id uuid primary key default gen_random_uuid(),
  provider text not null check (provider in ('patreon', 'subscribestar', 'boosty')),
  provider_user_id text not null,
  auth_user_id uuid references auth.users(id) on delete set null,
  access_token_encrypted text,
  refresh_token_encrypted text,
  token_expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, provider_user_id),
  unique (id, provider)
);
create index supporter_accounts_auth_user_idx
  on public.supporter_accounts (auth_user_id) where auth_user_id is not null;

create table public.supporter_entitlements (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null,
  provider text not null check (provider in ('patreon', 'subscribestar', 'boosty')),
  campaign_id text not null,
  patron_status text not null default 'unknown',
  tier_ids text[] not null default '{}',
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (account_id, provider, campaign_id),
  foreign key (account_id, provider)
    references public.supporter_accounts(id, provider) on delete cascade
);

create table public.early_access_releases (
  id uuid primary key default gen_random_uuid(),
  version text not null,
  platform text not null,
  storage_bucket text not null default 'early-access-builds'
    check (storage_bucket = 'early-access-builds'),
  object_path text not null check (length(object_path) > 0),
  unlock_at timestamptz not null,
  allowed_tier_ids text[] not null check (cardinality(allowed_tier_ids) > 0),
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  unique (storage_bucket, object_path)
);

create table public.download_grants (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.supporter_accounts(id) on delete cascade,
  release_id uuid not null references public.early_access_releases(id) on delete cascade,
  issued_at timestamptz not null default now(),
  expires_at timestamptz not null,
  constraint download_grant_expiry check (expires_at > issued_at)
);
create index download_grants_account_issued_idx on public.download_grants (account_id, issued_at desc);
create index download_grants_release_idx on public.download_grants (release_id);

create table public.webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null check (provider in ('patreon', 'subscribestar', 'boosty')),
  event_key text not null,
  payload_sha256 text not null,
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  status text not null default 'received',
  unique (provider, event_key)
);

create table public.supporter_oauth_states (
  state_hash text primary key,
  expires_at timestamptz not null,
  consumed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.supporter_sessions (
  token_hash text primary key,
  account_id uuid not null references public.supporter_accounts(id) on delete cascade,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);
create index supporter_sessions_account_idx on public.supporter_sessions(account_id);

create table public.early_access_rate_limits (
  key_hash text not null,
  window_start timestamptz not null,
  hits integer not null default 0,
  primary key (key_hash, window_start)
);

create table public.early_access_audit_events (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references public.supporter_accounts(id) on delete set null,
  action text not null,
  outcome text not null,
  created_at timestamptz not null default now()
);
create index early_access_audit_events_created_idx on public.early_access_audit_events(created_at desc);
create index early_access_audit_events_account_idx on public.early_access_audit_events(account_id);

-- Deny every browser-facing role. All entitlement mutations happen through a
-- server-only Supabase secret key, never via the anon/publishable key.
do $$
declare table_name text;
begin
  foreach table_name in array array[
    'supporter_accounts', 'supporter_entitlements', 'early_access_releases',
    'download_grants', 'webhook_events', 'supporter_oauth_states',
    'supporter_sessions', 'early_access_rate_limits', 'early_access_audit_events'
  ] loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('revoke all on public.%I from public, anon, authenticated', table_name);
    execute format(
      'create policy %I on public.%I as restrictive for all to anon, authenticated using (false) with check (false)',
      table_name || '_deny_client', table_name
    );
  end loop;
end $$;

grant select, insert, update, delete on public.supporter_accounts to service_role;
grant select, insert, update, delete on public.supporter_entitlements to service_role;
grant select, insert, update, delete on public.early_access_releases to service_role;
grant select, insert, update, delete on public.download_grants to service_role;
grant select, insert, update, delete on public.webhook_events to service_role;
grant select, insert, update, delete on public.supporter_oauth_states to service_role;
grant select, insert, update, delete on public.supporter_sessions to service_role;
grant select, insert, update, delete on public.early_access_rate_limits to service_role;
grant select, insert, update, delete on public.early_access_audit_events to service_role;

-- Atomic, one-use OAuth state consumption. The callback must also compare
-- the browser's HttpOnly state cookie before invoking this function.
create function public.consume_supporter_oauth_state(p_state_hash text)
returns boolean language plpgsql security invoker set search_path = '' as $$
declare consumed boolean;
begin
  update public.supporter_oauth_states
     set consumed_at = now()
   where state_hash = p_state_hash and consumed_at is null and expires_at > now()
  returning true into consumed;
  return coalesce(consumed, false);
end $$;

-- Fixed-window limiter; caller supplies a hashed IP or account key.
create function public.consume_early_access_rate_limit(
  p_key_hash text, p_max_hits integer, p_window_seconds integer
) returns boolean language plpgsql security invoker set search_path = '' as $$
declare allowed boolean;
declare current_window timestamptz;
begin
  if p_max_hits < 1 or p_window_seconds < 1 then return false; end if;
  current_window := to_timestamp(floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds);
  insert into public.early_access_rate_limits(key_hash, window_start, hits)
  values (p_key_hash, current_window, 1)
  on conflict (key_hash, window_start) do update
    set hits = public.early_access_rate_limits.hits + 1
    where public.early_access_rate_limits.hits < p_max_hits
  returning true into allowed;
  return coalesce(allowed, false);
end $$;

-- Run this function through a separately approved maintenance schedule.
-- Expired/revoked sessions remain invalid even before physical deletion.
create function public.prune_early_access_ephemeral()
returns table(oauth_states_deleted integer, sessions_deleted integer)
language plpgsql security invoker set search_path = '' as $$
begin
  delete from public.supporter_oauth_states
   where expires_at <= now() or consumed_at is not null;
  get diagnostics oauth_states_deleted = row_count;
  delete from public.supporter_sessions
   where expires_at <= now() or revoked_at is not null;
  get diagnostics sessions_deleted = row_count;
  return next;
end $$;

revoke all on function public.consume_supporter_oauth_state(text) from public, anon, authenticated;
revoke all on function public.consume_early_access_rate_limit(text, integer, integer) from public, anon, authenticated;
revoke all on function public.prune_early_access_ephemeral() from public, anon, authenticated;
grant execute on function public.consume_supporter_oauth_state(text) to service_role;
grant execute on function public.consume_early_access_rate_limit(text, integer, integer) to service_role;
grant execute on function public.prune_early_access_ephemeral() to service_role;

-- Create only a private bucket in the existing project. Inspect existing
-- storage.objects policies before applying: permissive policies elsewhere
-- may need a separate bucket-scoped review.
insert into storage.buckets (id, name, public)
values ('early-access-builds', 'early-access-builds', false);

-- Restrictive policy is ANDed with any existing permissive Storage policy.
-- It prevents broad legacy policies from exposing this bucket to clients.
create policy early_access_objects_block_clients on storage.objects
  as restrictive for all to anon, authenticated
  using (bucket_id <> 'early-access-builds')
  with check (bucket_id <> 'early-access-builds');
