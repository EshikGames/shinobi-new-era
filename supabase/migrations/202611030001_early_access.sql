-- REVIEW ONLY. Apply to the existing Supabase project after schema and Storage policy review.
-- The Patreon identity is the local supporter principal until an existing auth.users
-- account can be linked through a separately reviewed, explicit linking flow.

create table if not exists public.supporter_accounts (
  id uuid primary key default gen_random_uuid(),
  provider text not null check (provider in ('patreon', 'subscribestar', 'boosty')),
  provider_user_id text not null,
  auth_user_id uuid references auth.users(id) on delete set null,
  access_token_encrypted text,
  refresh_token_encrypted text,
  token_expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, provider_user_id)
);

create table if not exists public.supporter_entitlements (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.supporter_accounts(id) on delete cascade,
  provider text not null check (provider in ('patreon', 'subscribestar', 'boosty')),
  campaign_id text not null,
  patron_status text not null default 'unknown',
  tier_ids text[] not null default '{}',
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (account_id, provider, campaign_id)
);

create table if not exists public.early_access_releases (
  id uuid primary key default gen_random_uuid(),
  version text not null,
  platform text not null,
  storage_bucket text not null default 'early-access-builds',
  object_path text not null,
  unlock_at timestamptz not null,
  allowed_tier_ids text[] not null check (cardinality(allowed_tier_ids) > 0),
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  unique (storage_bucket, object_path)
);

create table if not exists public.download_grants (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.supporter_accounts(id) on delete cascade,
  release_id uuid not null references public.early_access_releases(id) on delete cascade,
  issued_at timestamptz not null default now(),
  expires_at timestamptz not null,
  constraint download_grant_expiry check (expires_at > issued_at)
);
create index if not exists download_grants_account_issued_idx on public.download_grants (account_id, issued_at desc);

create table if not exists public.webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null check (provider in ('patreon', 'subscribestar', 'boosty')),
  event_key text not null,
  payload_sha256 text not null,
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  status text not null default 'received',
  unique (provider, event_key)
);

create table if not exists public.supporter_oauth_states (
  state_hash text primary key,
  expires_at timestamptz not null,
  consumed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.supporter_sessions (
  token_hash text primary key,
  account_id uuid not null references public.supporter_accounts(id) on delete cascade,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists supporter_sessions_account_idx on public.supporter_sessions(account_id);

create table if not exists public.early_access_rate_limits (
  key_hash text not null,
  window_start timestamptz not null,
  hits integer not null default 0,
  primary key (key_hash, window_start)
);

create table if not exists public.early_access_audit_events (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references public.supporter_accounts(id) on delete set null,
  action text not null,
  outcome text not null,
  created_at timestamptz not null default now()
);
create index if not exists early_access_audit_events_created_idx on public.early_access_audit_events(created_at desc);

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
    execute format('revoke all on public.%I from anon, authenticated', table_name);
    execute format(
      'create policy %I on public.%I for all to anon, authenticated using (false) with check (false)',
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
create or replace function public.consume_supporter_oauth_state(p_state_hash text)
returns boolean language plpgsql security definer set search_path = public, pg_temp as $$
declare consumed boolean;
begin
  update public.supporter_oauth_states
     set consumed_at = now()
   where state_hash = p_state_hash and consumed_at is null and expires_at > now()
  returning true into consumed;
  return coalesce(consumed, false);
end $$;

-- Fixed-window limiter; caller supplies a hashed IP or account key.
create or replace function public.consume_early_access_rate_limit(
  p_key_hash text, p_max_hits integer, p_window_seconds integer
) returns boolean language plpgsql security definer set search_path = public, pg_temp as $$
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

revoke all on function public.consume_supporter_oauth_state(text) from public, anon, authenticated;
revoke all on function public.consume_early_access_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_supporter_oauth_state(text) to service_role;
grant execute on function public.consume_early_access_rate_limit(text, integer, integer) to service_role;

-- Create only a private bucket in the existing project. Inspect existing
-- storage.objects policies before applying: permissive policies elsewhere
-- may need a separate bucket-scoped review.
insert into storage.buckets (id, name, public)
values ('early-access-builds', 'early-access-builds', false)
on conflict (id) do nothing;

-- Restrictive policy is ANDed with any existing permissive Storage policy.
-- It prevents broad legacy policies from exposing this bucket to clients.
create policy early_access_objects_block_clients on storage.objects
  as restrictive for all to anon, authenticated
  using (bucket_id <> 'early-access-builds')
  with check (bucket_id <> 'early-access-builds');

do $$ begin
  if exists (select 1 from storage.buckets where id = 'early-access-builds' and public) then
    raise exception 'early-access-builds bucket already exists and is public';
  end if;
end $$;
