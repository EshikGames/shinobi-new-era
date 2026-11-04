-- READ ONLY. Only avdkvtmugeizoqqvayek, after separately approved application.
-- No RPC execution, email list, token, Storage object or personal-data reads.
with expected(name) as (values ('ea_supporter_list'),('ea_list_provider_policies'),('ea_list_sessions'),
 ('ea_list_downloads'),('ea_list_release_rules'),('ea_list_audit'))
select e.name,c.oid is not null as exists_in_public,c.relrowsecurity as rls,
 coalesce(has_table_privilege('anon',c.oid,'SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER'),false) as anon_any_access,
 coalesce(has_table_privilege('authenticated',c.oid,'SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER'),false) as authenticated_any_access,
 coalesce(has_table_privilege('service_role',c.oid,'SELECT'),false) as service_select,
 coalesce(has_table_privilege('service_role',c.oid,'INSERT'),false) as service_insert,
 coalesce(has_table_privilege('service_role',c.oid,'UPDATE'),false) as service_update,
 coalesce(has_table_privilege('service_role',c.oid,'DELETE'),false) as service_delete,
 coalesce(has_table_privilege('service_role',c.oid,'TRUNCATE'),false) as service_truncate,
 coalesce(has_table_privilege('service_role',c.oid,'REFERENCES'),false) as service_references,
 coalesce(has_table_privilege('service_role',c.oid,'TRIGGER'),false) as service_trigger
from expected e left join pg_namespace n on n.nspname='public'
left join pg_class c on c.relnamespace=n.oid and c.relname=e.name order by e.name;
-- Expected: six deny policies; no permissive client policy. Audit UPDATE/DELETE must be false for service_role.
-- TRUNCATE/REFERENCES/TRIGGER must be false for service_role on all six new tables.
select tablename,policyname,permissive,roles,cmd,qual,with_check from pg_policies
where schemaname='public' and tablename in ('ea_supporter_list','ea_list_provider_policies','ea_list_sessions',
 'ea_list_downloads','ea_list_release_rules','ea_list_audit') order by tablename,policyname;
select p.proname,pg_get_function_identity_arguments(p.oid) as arguments,p.prosecdef,p.proconfig,
 has_function_privilege('anon',p.oid,'EXECUTE') as anon_execute,
 has_function_privilege('authenticated',p.oid,'EXECUTE') as authenticated_execute,
 has_function_privilege('service_role',p.oid,'EXECUTE') as service_execute
from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public'
and p.proname in ('reserve_ea_list_download','prune_ea_list_sessions','audit_ea_list_admin');
-- Expected: no SECURITY DEFINER, empty search_path, clients false, service true.
select c.relname,con.conname,pg_get_constraintdef(con.oid) as definition
from pg_constraint con join pg_class c on c.oid=con.conrelid join pg_namespace n on n.oid=c.relnamespace
where n.nspname='public' and c.relname in ('ea_supporter_list','ea_list_provider_policies','ea_list_sessions',
 'ea_list_downloads','ea_list_release_rules','ea_list_audit') order by c.relname,con.conname;
select c.relname,t.tgname,t.tgenabled,pg_get_triggerdef(t.oid) as definition
from pg_trigger t join pg_class c on c.oid=t.tgrelid join pg_namespace n on n.oid=c.relnamespace
where n.nspname='public' and not t.tgisinternal
and c.relname in ('ea_supporter_list','ea_list_provider_policies','ea_list_release_rules');
-- Expected: three enabled admin audit triggers. Initial seed is platform config only, not subscribers.
select provider,enabled,(approval_reference is not null) as has_permission_reference from public.ea_list_provider_policies;
select id,name,public from storage.buckets order by id;
select policyname,permissive,roles,cmd,qual,with_check from pg_policies
where schemaname='storage' and tablename='objects' order by policyname;
-- Compare bucket/policy output against preflight: unchanged, early-access-builds remains private.
