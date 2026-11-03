-- READ ONLY. Run only after an approved migration in the dedicated project
-- avdkvtmugeizoqqvayek. No RPC calls or user-row reads.

-- 1. Exactly nine Early Access tables should exist. Each must have RLS and a
-- restrictive deny policy, no client DML grants, and service_role DML grants.
with expected(table_name) as (
  values ('supporter_accounts'), ('supporter_entitlements'),
         ('early_access_releases'), ('download_grants'), ('webhook_events'),
         ('supporter_oauth_states'), ('supporter_sessions'),
         ('early_access_rate_limits'), ('early_access_audit_events')
)
select e.table_name,
       c.oid is not null as exists_in_public,
       c.relrowsecurity as rls_enabled,
       exists (
         select 1 from pg_policies p
         where p.schemaname = 'public' and p.tablename = e.table_name
           and p.policyname = e.table_name || '_deny_client'
           and p.permissive = 'RESTRICTIVE' and p.cmd = 'ALL'
           and p.roles @> array['anon', 'authenticated']::name[]
           and p.qual = 'false' and p.with_check = 'false'
       ) as restrictive_client_deny,
       coalesce(has_table_privilege('anon', c.oid, 'SELECT,INSERT,UPDATE,DELETE'), false)
         as anon_has_any_dml,
       coalesce(has_table_privilege('authenticated', c.oid, 'SELECT,INSERT,UPDATE,DELETE'), false)
         as authenticated_has_any_dml,
       coalesce(has_table_privilege('service_role', c.oid, 'SELECT'), false)
         and coalesce(has_table_privilege('service_role', c.oid, 'INSERT'), false)
         and coalesce(has_table_privilege('service_role', c.oid, 'UPDATE'), false)
         and coalesce(has_table_privilege('service_role', c.oid, 'DELETE'), false)
         as service_role_has_all_dml
from expected e
left join pg_namespace n on n.nspname = 'public'
left join pg_class c on c.relnamespace = n.oid and c.relname = e.table_name
order by e.table_name;

-- 2. Function ownership, invoker mode, fixed search_path and EXECUTE grants.
with expected(signature) as (
  values ('public.consume_supporter_oauth_state(text)'),
         ('public.consume_early_access_rate_limit(text,integer,integer)'),
         ('public.prune_early_access_ephemeral()')
)
select e.signature, p.oid is not null as exists_in_public,
       p.prosecdef as security_definer,
       p.proconfig as function_settings,
       coalesce(has_function_privilege('anon', p.oid, 'EXECUTE'), false)
         as anon_can_execute,
       coalesce(has_function_privilege('authenticated', p.oid, 'EXECUTE'), false)
         as authenticated_can_execute,
       coalesce(has_function_privilege('service_role', p.oid, 'EXECUTE'), false)
         as service_role_can_execute
from expected e
left join pg_proc p on p.oid = to_regprocedure(e.signature)
order by e.signature;

-- 3. The bucket must be private. Compare all other buckets to the saved
-- pre-migration inventory; this query alone cannot prove they were unchanged.
select id, name, public, file_size_limit, allowed_mime_types
from storage.buckets
order by id;

-- 4. The new Storage policy must be RESTRICTIVE and exclude only this bucket.
-- Compare all other policies to the saved pre-migration inventory.
select policyname, permissive, roles, cmd, qual, with_check
from pg_policies
where schemaname = 'storage' and tablename = 'objects'
order by policyname;

-- 5. Confirm the standard service role still bypasses RLS.
select rolname, rolbypassrls from pg_roles
where rolname in ('anon', 'authenticated', 'service_role')
order by rolname;

-- 6. Review new foreign keys; no existing game table should be a referenced
-- or referencing relation. auth.users is the only existing-table reference.
select con.conname, con.conrelid::regclass as source_table,
       con.confrelid::regclass as target_table,
       pg_get_constraintdef(con.oid) as definition
from pg_constraint con
join pg_class c on c.oid = con.conrelid
where con.contype = 'f'
  and con.connamespace = 'public'::regnamespace
  and c.relname = any (array[
    'supporter_accounts', 'supporter_entitlements', 'download_grants',
    'supporter_sessions', 'early_access_audit_events'
  ])
order by c.relname, con.conname;

-- 7. A clean project may have no CLI history table yet, especially when the
-- migration was applied through SQL Editor. This query remains read-only and
-- works in either case. After CLI deployment/repair, use
-- `supabase migration list --remote` to confirm version 20261103000100.
select to_regclass('supabase_migrations.schema_migrations') is not null
  as migration_history_table_exists;
