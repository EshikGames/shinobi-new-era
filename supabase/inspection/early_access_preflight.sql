-- READ ONLY. Run only in project avdkvtmugeizoqqvayek.
-- Never run Early Access SQL in the game-privileges Supabase project.

-- 0. The dedicated project should have no application-owned public relations.
-- Extension-owned objects are excluded. Expected result: zero rows.
select c.relname as object_name, c.relkind
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relkind in ('r', 'p', 'v', 'm', 'f')
  and not exists (
    select 1 from pg_depend d
    where d.classid = 'pg_class'::regclass and d.objid = c.oid
      and d.deptype = 'e'
  )
order by c.relname;

-- 1. Name collisions with the proposed Early Access objects.
select n.nspname as schema_name, c.relname as object_name, c.relkind,
       c.relrowsecurity as rls_enabled
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relname = any (array[
    'supporter_accounts', 'supporter_entitlements', 'early_access_releases',
    'download_grants', 'webhook_events', 'supporter_oauth_states',
    'supporter_sessions', 'early_access_rate_limits', 'early_access_audit_events',
    'supporter_accounts_auth_user_idx', 'download_grants_account_issued_idx',
    'download_grants_release_idx', 'supporter_sessions_account_idx',
    'early_access_audit_events_account_idx', 'early_access_audit_events_created_idx'
  ])
order by c.relname;

-- 2. Existing functions with the names reserved by the migration.
select n.nspname as schema_name, p.proname as function_name,
       pg_get_function_identity_arguments(p.oid) as arguments
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname = any (array[
    'consume_supporter_oauth_state', 'consume_early_access_rate_limit',
    'prune_early_access_ephemeral'
  ])
order by p.proname;

-- 3. Existing Storage buckets; neither id nor name may already be used.
select id, name, public from storage.buckets
where id = 'early-access-builds' or name = 'early-access-builds';

-- 4. Existing Storage policies. Review broad SELECT/INSERT grants with care.
select policyname, permissive, roles, cmd, qual, with_check
from pg_policies
where schemaname = 'storage' and tablename = 'objects'
order by policyname;

-- 5. Existing Auth table metadata; never read user rows.
select n.nspname as schema_name, c.relname as table_name,
       c.relkind, c.relrowsecurity as rls_enabled
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'auth' and c.relname = 'users';

-- 5a. The migration assumes standard Supabase roles and service_role BYPASSRLS.
select rolname, rolbypassrls from pg_roles
where rolname in ('anon', 'authenticated', 'service_role')
order by rolname;

-- 5b. The existing Storage objects table must have RLS enabled.
select n.nspname as schema_name, c.relname as table_name,
       c.relrowsecurity as rls_enabled
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'storage' and c.relname = 'objects';

-- 6. The exact RLS and grants on any colliding public tables.
select n.nspname as schema_name, c.relname as table_name,
       c.relrowsecurity as rls_enabled, c.relforcerowsecurity as force_rls
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relkind in ('r', 'p')
  and c.relname = any (array[
    'supporter_accounts', 'supporter_entitlements', 'early_access_releases',
    'download_grants', 'webhook_events', 'supporter_oauth_states',
    'supporter_sessions', 'early_access_rate_limits', 'early_access_audit_events'
  ])
order by c.relname;

select grantee, table_name, privilege_type
from information_schema.role_table_grants
where table_schema = 'public'
  and table_name = any (array[
    'supporter_accounts', 'supporter_entitlements', 'early_access_releases',
    'download_grants', 'webhook_events', 'supporter_oauth_states',
    'supporter_sessions', 'early_access_rate_limits', 'early_access_audit_events'
  ])
order by table_name, grantee, privilege_type;
