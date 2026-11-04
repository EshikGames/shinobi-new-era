-- WRITE MIGRATION PROPOSAL. Apply exclusively to avdkvtmugeizoqqvayek after explicit approval.
-- Independent of the unapproved manual-OTP proposal. Requires only existing 20261103000100 schema.
-- Claimed email + active entry + permitted tier + approved platform. No ownership verification.
-- RLS and ACLs are explicit immediately after each CREATE TABLE, all before COMMIT.
-- Run the complete transaction only. Never bypass a Dashboard RLS warning.
begin;
set local lock_timeout='5s';
set local statement_timeout='60s';
-- Dashboard/CLI target must be verified separately: SQL cannot prove a hosted project ID.
do $$ begin
  if to_regclass('public.early_access_releases') is null or to_regclass('public.supporter_sessions') is null
    or not exists (select 1 from pg_roles where rolname='service_role' and rolbypassrls)
    then raise exception 'Required website schema/roles absent'; end if;
end $$;
create table public.ea_list_provider_policies (
  provider text primary key check (provider in ('subscribestar','boosty')),
  enabled boolean not null default false,
  approval_reference text,
  check (not enabled or (approval_reference is not null and length(btrim(approval_reference))>0))
);
ALTER TABLE public.ea_list_provider_policies ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.ea_list_provider_policies FROM PUBLIC, anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.ea_list_provider_policies TO service_role;
CREATE POLICY deny_client_access ON public.ea_list_provider_policies
  AS RESTRICTIVE FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
comment on table public.ea_list_provider_policies is 'Owner records a nonsecret platform permission/policy review reference before enabling external benefits. Never store credentials here.';
insert into public.ea_list_provider_policies(provider) values ('subscribestar'),('boosty');
create table public.ea_supporter_list (
  id uuid primary key default gen_random_uuid(),
  email text not null check (email=lower(btrim(email)) and length(email) between 3 and 254 and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  provider text not null references public.ea_list_provider_policies(provider),
  subscription_tier text not null check (subscription_tier=btrim(subscription_tier) and length(subscription_tier) between 1 and 160 and subscription_tier !~ '[[:cntrl:]]'),
  status text not null default 'inactive' check (status in ('active','inactive','revoked')),
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  reviewed_at timestamptz,
  is_test boolean not null default false,
  check (expires_at is null or (isfinite(expires_at) and expires_at>created_at)),
  check (reviewed_at is null or isfinite(reviewed_at)),
  unique(provider,email)
);
ALTER TABLE public.ea_supporter_list ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.ea_supporter_list FROM PUBLIC, anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.ea_supporter_list TO service_role;
CREATE POLICY deny_client_access ON public.ea_supporter_list
  AS RESTRICTIVE FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
comment on table public.ea_supporter_list is 'Owner-maintained Early Access list; active, allowed tier, approved platform and unexpired access required. No platform API verification.';
comment on column public.ea_supporter_list.subscription_tier is 'Exact allowed names: Resonance Adept, Otsutsuki Chosen, New Era Architect. Other names can be recorded but do not grant access.';
comment on column public.ea_supporter_list.expires_at is 'NULL means access remains until the owner changes status or deletes the entry.';

create table public.ea_list_sessions (
  token_hash text primary key check (token_hash ~ '^[0-9a-f]{64}$'),
  email_encrypted text not null,
  subject_hash text not null check (subject_hash ~ '^[0-9a-f]{64}$'),
  provider text not null references public.ea_list_provider_policies(provider),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  revoked_at timestamptz,
  check (expires_at>created_at and expires_at<=created_at+interval '30 minutes')
);
ALTER TABLE public.ea_list_sessions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.ea_list_sessions FROM PUBLIC, anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.ea_list_sessions TO service_role;
CREATE POLICY deny_client_access ON public.ea_list_sessions
  AS RESTRICTIVE FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
create index ea_list_sessions_expiry on public.ea_list_sessions(expires_at);
create table public.ea_list_downloads (
  id uuid primary key default gen_random_uuid(),
  subject_hash text not null check (subject_hash ~ '^[0-9a-f]{64}$'),
  release_id uuid not null references public.early_access_releases(id),
  issued_at timestamptz not null default now(),
  expires_at timestamptz not null check (expires_at>issued_at)
);
ALTER TABLE public.ea_list_downloads ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.ea_list_downloads FROM PUBLIC, anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.ea_list_downloads TO service_role;
CREATE POLICY deny_client_access ON public.ea_list_downloads
  AS RESTRICTIVE FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
create index ea_list_downloads_subject_time on public.ea_list_downloads(subject_hash,issued_at);
create table public.ea_list_release_rules (
  release_id uuid primary key references public.early_access_releases(id),
  public_release_at timestamptz not null check (isfinite(public_release_at)),
  allowed_tiers text[] not null default array['Resonance Adept','Otsutsuki Chosen','New Era Architect']
    check (cardinality(allowed_tiers)>0 and array_position(allowed_tiers,null) is null
      and allowed_tiers <@ array['Resonance Adept','Otsutsuki Chosen','New Era Architect'])
);
ALTER TABLE public.ea_list_release_rules ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.ea_list_release_rules FROM PUBLIC, anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.ea_list_release_rules TO service_role;
CREATE POLICY deny_client_access ON public.ea_list_release_rules
  AS RESTRICTIVE FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
comment on table public.ea_list_release_rules is 'Opt-in common 14-day schedule. Both server download paths validate public_release_at against the existing unlock_at. No releases are seeded.';
create table public.ea_list_audit (
  id uuid primary key default gen_random_uuid(),
  occurred_at timestamptz not null default clock_timestamp(),
  action text not null check (length(action) between 1 and 64),
  outcome text not null check (length(outcome) between 1 and 64),
  subject_hash text check (subject_hash ~ '^[0-9a-f]{64}$'),
  actor_role text not null default current_user,
  actor_id uuid,
  target_id text,
  change_summary jsonb
);
ALTER TABLE public.ea_list_audit ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.ea_list_audit FROM PUBLIC, anon, authenticated, service_role;
-- Clear default grants too: the server may append/read the audit, never mutate or truncate it.
GRANT SELECT, INSERT ON TABLE public.ea_list_audit TO service_role;
CREATE POLICY deny_client_access ON public.ea_list_audit
  AS RESTRICTIVE FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
create index ea_list_audit_time on public.ea_list_audit(occurred_at);

-- Dashboard writes require a trusted owner/admin account, not a website email session.
-- Trigger is INVOKER; no bypass credentials or SECURITY DEFINER are introduced.
create function public.audit_ea_list_admin() returns trigger language plpgsql security invoker set search_path='' as $$
declare previous jsonb; following jsonb;
begin
  if tg_op<>'INSERT' then previous=to_jsonb(old); end if;
  if tg_op<>'DELETE' then
    if tg_table_name='ea_supporter_list' then
      new.email=lower(btrim(new.email));
      new.updated_at=clock_timestamp();
    end if;
    following=to_jsonb(new);
  end if;
  insert into public.ea_list_audit(action,outcome,actor_id,target_id,change_summary)
  values ('admin_'||lower(tg_op),'recorded',auth.uid(),
    coalesce(following->>'id',previous->>'id',following->>'provider',previous->>'provider',following->>'release_id',previous->>'release_id'),
    jsonb_build_object('table',tg_table_name,
      'before',previous - array['email','approval_reference'], 'after',following - array['email','approval_reference']));
  if tg_op='DELETE' then return old; else return new; end if;
end $$;
revoke all on function public.audit_ea_list_admin() from public,anon,authenticated;
grant execute on function public.audit_ea_list_admin() to service_role;
create trigger ea_list_admin_audit before insert or update or delete on public.ea_supporter_list
  for each row execute function public.audit_ea_list_admin();
create trigger ea_list_policy_audit before insert or update or delete on public.ea_list_provider_policies
  for each row execute function public.audit_ea_list_admin();
create trigger ea_list_release_audit before insert or update or delete on public.ea_list_release_rules
  for each row execute function public.audit_ea_list_admin();

create function public.reserve_ea_list_download(p_session_hash text,p_subject_hash text,p_email text,p_release uuid,p_object_path text)
returns void language plpgsql security invoker set search_path='' as $$
declare s public.ea_list_sessions; r public.early_access_releases; entry public.ea_supporter_list; rules public.ea_list_release_rules;
begin
  select * into s from public.ea_list_sessions where token_hash=p_session_hash and subject_hash=p_subject_hash
    and revoked_at is null and expires_at>clock_timestamp() for share;
  if not found then raise exception 'unauthorized'; end if;
  -- Invoked only by trusted server after decrypting and binding the session email.
  select l.* into entry from public.ea_supporter_list l join public.ea_list_provider_policies p on p.provider=l.provider
    where l.email=p_email and l.provider=s.provider and l.status='active' and p.enabled and length(btrim(p.approval_reference))>0
    and l.subscription_tier in ('Resonance Adept','Otsutsuki Chosen','New Era Architect')
    and (l.expires_at is null or l.expires_at>clock_timestamp()) for share of l,p;
  if not found then raise exception 'access_denied'; end if;
  select * into r from public.early_access_releases where id=p_release for share;
  if not found or r.is_published is not true or r.storage_bucket is distinct from 'early-access-builds'
    or r.object_path is null or length(r.object_path)=0 or r.object_path is distinct from p_object_path
    or r.unlock_at is null or r.unlock_at>clock_timestamp() then raise exception 'release_unavailable'; end if;
  select * into rules from public.ea_list_release_rules where release_id=r.id for share;
  if not found or extract(epoch from (rules.public_release_at-r.unlock_at))<>1209600
    or not (entry.subscription_tier=any(rules.allowed_tiers)) then raise exception 'release_unavailable'; end if;
  insert into public.ea_list_downloads(subject_hash,release_id,expires_at) values(p_subject_hash,r.id,clock_timestamp()+interval '60 seconds');
end $$;
revoke all on function public.reserve_ea_list_download(text,text,text,uuid,text) from public,anon,authenticated;
grant execute on function public.reserve_ea_list_download(text,text,text,uuid,text) to service_role;
create function public.prune_ea_list_sessions() returns void language sql security invoker set search_path='' as $$
  delete from public.ea_list_sessions where expires_at<=now() or revoked_at is not null;
$$;
revoke all on function public.prune_ea_list_sessions() from public,anon,authenticated;
grant execute on function public.prune_ea_list_sessions() to service_role;
-- No subscriber data, permissions in other projects, bucket changes or scheduler are added.
commit;
