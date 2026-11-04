// MOCK integration of the actual route dispatcher. No Supabase, SMTP or Storage network calls.
import test from 'node:test';
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import { randomBytes } from 'node:crypto';

const id = '11111111-1111-4111-8111-111111111111';
const key = randomBytes(32), now = () => new Date().toISOString(), future = () => new Date(Date.now() + 600000).toISOString();
let rows, rate, sentError, outage, otpUsed, user, calls, bucketPublic, storageMissing, reserveFails;
function reset() {
  delete process.env.EARLY_ACCESS_LIST_TEST_ENABLED;
  delete process.env.EARLY_ACCESS_LIST_TEST_PROTECTION_CONFIRMED;
  delete process.env.VERCEL;
  delete process.env.VERCEL_ENV;
  delete process.env.VERCEL_URL;
  rows = { ea_provider_policies: ['boosty', 'subscribestar'].map(provider => ({ provider, status: 'approved', approval_reference: 'mock-owner-letter', reviewed_at: now(), review_due_at: future() })) };
  rate = new Map(); sentError = false; outage = false; otpUsed = false; user = { id, email: 'test@example.test', email_confirmed_at: now() }; calls = [];
  bucketPublic = false; storageMissing = false; reserveFails = false;
  Object.assign(process.env, { EARLY_ACCESS_EMAIL_ENABLED: 'true', EARLY_ACCESS_MANUAL_PROVIDERS: 'boosty,subscribestar',
    SITE_URL: 'https://example.test', NODE_ENV: 'test', SUPABASE_PROJECT_REF: 'avdkvtmugeizoqqvayek',
    SUPABASE_URL: 'https://avdkvtmugeizoqqvayek.supabase.co', SUPABASE_SERVICE_ROLE_KEY: 'mock-service-role',
    SUPABASE_PUBLISHABLE_KEY: 'mock-publishable', SUPPORTER_TOKEN_ENCRYPTION_KEY: key.toString('base64') });
}
class Query {
  constructor(table) { this.table = table; this.filters = []; this.operation = 'select'; }
  select() { return this; }
  eq(k, v) { this.filters.push(r => r[k] === v); return this; }
  is(k, v) { this.filters.push(r => (r[k] ?? null) === v); return this; }
  gt(k, v) { this.filters.push(r => r[k] > v); return this; }
  order() { return this; }
  limit() { return this; }
  maybeSingle() { this.single = true; return this; }
  insert(value) { this.operation = 'insert'; this.value = value; return this; }
  update(value) { this.operation = 'update'; this.value = value; return this; }
  then(resolve, reject) {
    try {
      if (outage) return resolve({ error: { code: 'mock_db_outage' } });
      const table = rows[this.table] ??= [];
      let result;
      if (this.operation === 'insert') { table.push(structuredClone(this.value)); result = [this.value]; }
      else { result = table.filter(r => this.filters.every(f => f(r))); if (this.operation === 'update') result.forEach(r => Object.assign(r, this.value)); }
      resolve({ data: structuredClone(this.single ? result[0] ?? null : result), error: null });
    } catch (error) { reject(error); }
  }
}
globalThis.__eaMockClient = () => ({
  from: name => new Query(name),
  rpc: async (name, args) => {
    calls.push(name);
    if (outage) return { error: {} };
    if (name === 'consume_early_access_rate_limit') { const count = (rate.get(args.p_key_hash) ?? 0) + 1; rate.set(args.p_key_hash, count); return { data: count <= args.p_max_hits }; }
    if (['reserve_ea_manual_download', 'reserve_ea_list_download'].includes(name) && reserveFails) return { error: {} };
    return { data: null }; // SQL behavior is NOT simulated or claimed as tested.
  },
  auth: {
    signInWithOtp: async args => { calls.push({ send: args.options.shouldCreateUser }); return { error: sentError ? {} : null }; },
    verifyOtp: async args => {
      calls.push('verifyOtp');
      if (outage || otpUsed || args.token !== '123456') return { error: { code: 'otp_expired' } };
      otpUsed = true;
      return { data: { user, session: { access_token: 'mock-access-token', expires_at: Math.floor(Date.now() / 1000) + 3600 } } };
    },
    getUser: async () => ({ data: { user }, error: outage ? {} : null }),
  },
  storage: {
    getBucket: async () => { calls.push('getBucket'); return { data: { public: bucketPublic } }; },
    from: () => ({
      info: async () => { calls.push('fileInfo'); return storageMissing ? { error: {} } : { data: { id: 'mock-file' } }; },
      createSignedUrl: async (_path, ttl) => { calls.push(`sign:${ttl}`); return { data: { signedUrl: 'https://mock.invalid/signed' } }; },
    }),
  },
});
registerHooks({ resolve(specifier, context, next) {
  if (specifier === 'server-only') return { url: 'data:text/javascript,export {}', shortCircuit: true };
  if (specifier === '@supabase/supabase-js') return { url: 'data:text/javascript,export const createClient = (...args) => globalThis.__eaMockClient(...args)', shortCircuit: true };
  if (specifier === 'next/server') return next('next/server.js', context);
  if (context.parentURL?.includes('/lib/early-access/') && ['./db', './response'].includes(specifier)) return next(specifier + '.js', context);
  return next(specifier, context);
} });
const { supporterListHandler } = await import('../lib/early-access/supporter-list-server.js');
function request(body = {}, cookies = {}, origin = 'https://example.test', method = 'POST') {
  const req = new Request('https://example.test/api/mock', { method,
    headers: { origin, 'content-type': 'application/json' }, ...(method === 'POST' ? { body: JSON.stringify(body) } : {}) });
  req.cookies = { get: name => cookies[name] ? { value: cookies[name] } : undefined }; return req;
}
function cookie(response, name) { return response.cookies.get(name)?.value; }
test('MOCK list route: email alone grants a claim session, never sends OTP or claims verified identity', async () => {
  reset(); process.env.EARLY_ACCESS_LIST_ENABLED = 'true';
  rows.ea_supporter_list = [{ email: 'test@example.test', provider: 'boosty', subscription_tier: 'Resonance Adept', status: 'active', expires_at: null, provider_policy: { enabled: true, approval_reference: 'mock permission' } }];
  const response = await supporterListHandler('start', request({ provider: 'boosty', email: ' Test@Example.Test ', tier: 'forged', status: 'active' }));
  assert.equal(response.status, 200); assert.equal((await response.json()).identityVerified, false);
  assert.ok(!calls.includes('verifyOtp')); assert.ok(!calls.some(c => typeof c === 'object' && 'send' in c));
  assert.ok(!JSON.stringify(rows.ea_list_sessions).includes('test@example.test'));
  const cookies = { '__Host-sne_supporter_list': cookie(response, '__Host-sne_supporter_list') };
  let status = await (await supporterListHandler('status', request({}, cookies, undefined, 'GET'))).json();
  assert.equal(status.status, 'active'); assert.equal(status.subscription_tier, undefined); assert.equal(status.email, undefined);
  rows.ea_supporter_list[0].status = 'revoked';
  status = await (await supporterListHandler('status', request({}, cookies, undefined, 'GET'))).json(); assert.equal(status.status, 'expired');
  assert.equal((await supporterListHandler('logout', request({}, cookies))).status, 200);
  assert.equal((await supporterListHandler('download', request({ releaseId: id }, cookies))).status, 401);
});
test('MOCK list route: missing email, forged status, CSRF, attempt limits and DB failures deny', async () => {
  reset(); process.env.EARLY_ACCESS_LIST_ENABLED = 'true';
  assert.equal((await supporterListHandler('start', request({ provider: 'boosty', email: user.email }, {}, 'https://evil.test'))).status, 403);
  for (let i = 0; i < 5; i++) assert.equal((await supporterListHandler('start', request({ provider: 'boosty', email: user.email, status: 'active' }))).status, 403);
  assert.equal((await supporterListHandler('start', request({ provider: 'boosty', email: user.email }))).status, 429);
  reset(); process.env.EARLY_ACCESS_LIST_ENABLED = 'true'; outage = true;
  assert.equal((await supporterListHandler('start', request({ provider: 'boosty', email: user.email }))).status, 503);
  process.env.EARLY_ACCESS_LIST_ENABLED = 'false';
});

function listFixture() {
  reset(); process.env.EARLY_ACCESS_LIST_ENABLED = 'true';
  rows.ea_supporter_list = [{ email: user.email, provider: 'boosty', subscription_tier: 'Resonance Adept', status: 'active', expires_at: null,
    provider_policy: { enabled: true, approval_reference: 'mock-only permission' } }];
  rows.early_access_releases = [{ id, storage_bucket: 'early-access-builds', object_path: 'mock/private.zip', is_published: true,
    unlock_at: new Date(Date.now() - 10000).toISOString() }];
  rows.early_access_releases[0].list_rules = { public_release_at: new Date(Date.parse(rows.early_access_releases[0].unlock_at) + 14 * 86400000).toISOString(), allowed_tiers: ['Resonance Adept', 'Otsutsuki Chosen', 'New Era Architect'] };
}
async function listLogin() {
  const response = await supporterListHandler('start', request({ provider: 'boosty', email: user.email }));
  assert.equal(response.status, 200);
  for (const flag of ['HttpOnly', 'Secure', 'SameSite=strict', 'Path=/', 'Max-Age=1800']) assert.ok(response.headers.get('set-cookie').includes(flag));
  return { '__Host-sne_supporter_list': cookie(response, '__Host-sne_supporter_list') };
}
test('MOCK list route: tier and platform permission are mandatory at login, not supplied by browser', async () => {
  for (const scenario of ['wrong-tier', 'missing-permission', 'disabled-platform', 'expired', 'inactive']) {
    listFixture(); const row = rows.ea_supporter_list[0];
    if (scenario === 'wrong-tier') row.subscription_tier = 'Karma Bearer';
    if (scenario === 'missing-permission') row.provider_policy.approval_reference = null;
    if (scenario === 'disabled-platform') row.provider_policy.enabled = false;
    if (scenario === 'expired') row.expires_at = '2000-01-01T00:00:00Z';
    if (scenario === 'inactive') row.status = 'inactive';
    const response = await supporterListHandler('start', request({ provider: 'boosty', email: user.email, subscription_tier: 'Resonance Adept', enabled: true, status: 'active', approval_reference: 'forged' }));
    assert.equal(response.status, 403, scenario); assert.equal(rows.ea_list_sessions?.length ?? 0, 0);
  }
  process.env.EARLY_ACCESS_LIST_ENABLED = 'false';
});
test('MOCK list route: download rechecks tier, permission, release, storage and final reservation', async () => {
  for (const scenario of ['success', 'changed-tier', 'platform-disabled', 'revoked', 'expired', 'no-release', 'unpublished', 'locked', 'public-bucket', 'missing-file', 'reservation-failed']) {
    listFixture(); const cookies = await listLogin();
    const row = rows.ea_supporter_list[0], release = rows.early_access_releases[0];
    if (scenario === 'changed-tier') row.subscription_tier = 'Karma Bearer';
    if (scenario === 'platform-disabled') row.provider_policy.enabled = false;
    if (scenario === 'revoked') row.status = 'revoked';
    if (scenario === 'expired') row.expires_at = '2000-01-01T00:00:00Z';
    if (scenario === 'no-release') rows.early_access_releases = [];
    if (scenario === 'unpublished') release.is_published = false;
    if (scenario === 'locked') release.unlock_at = future();
    if (scenario === 'public-bucket') bucketPublic = true;
    if (scenario === 'missing-file') storageMissing = true;
    if (scenario === 'reservation-failed') reserveFails = true;
    const response = await supporterListHandler('download', request({ releaseId: id, email: 'other@example.test', subscription_tier: 'forged', object_path: 'forged.zip' }, cookies));
    const body = await response.json();
    assert.equal(typeof body.url === 'string', scenario === 'success', scenario);
    if (scenario === 'success') {
      assert.equal(response.status, 200); assert.equal(body.expiresIn, 60);
      for (const name of ['getBucket', 'fileInfo', 'sign:60', 'reserve_ea_list_download']) assert.ok(calls.includes(name));
    } else assert.ok(response.status >= 400, scenario);
  }
  process.env.EARLY_ACCESS_LIST_ENABLED = 'false';
});
test('MOCK list route: missing, expired and corrupt sessions deny; list session never grants admin rights', async () => {
  listFixture(); assert.equal((await supporterListHandler('download', request({ releaseId: id }))).status, 401);
  for (const scenario of ['expired', 'corrupt', 'mismatched-subject', 'unknown-cookie']) {
    listFixture(); const cookies = await listLogin();
    if (scenario === 'expired') rows.ea_list_sessions[0].expires_at = '2000-01-01T00:00:00Z';
    if (scenario === 'corrupt') rows.ea_list_sessions[0].email_encrypted = 'corrupt';
    if (scenario === 'mismatched-subject') rows.ea_list_sessions[0].subject_hash = '0'.repeat(64);
    if (scenario === 'unknown-cookie') cookies['__Host-sne_supporter_list'] = randomBytes(32).toString('base64url');
    const response = await supporterListHandler('download', request({ releaseId: id }, cookies));
    assert.ok(response.status >= 400); assert.equal((await response.json()).url, undefined);
  }
  listFixture(); await listLogin();
  assert.equal(rows.ea_email_sessions?.length ?? 0, 0);
  process.env.EARLY_ACCESS_LIST_ENABLED = 'false';
});

test('MOCK email-only: a stranger knowing the listed email gets access by the explicitly accepted rule', async () => {
  listFixture(); const cookies = await listLogin(); // No prior identity, OTP, password or provider token.
  const status = await (await supporterListHandler('status', request({}, cookies, undefined, 'GET'))).json();
  assert.equal(status.identityVerified, false); assert.equal(status.tier, 'Resonance Adept');
  assert.equal(status.provider, 'boosty'); assert.equal(status.accessExpiresAt, null);
  for (const field of ['email', 'id', 'rows', 'provider_policy', 'approval_reference', 'subject_hash', 'token_hash']) assert.equal(status[field], undefined);
  assert.ok(!JSON.stringify(rows.ea_list_audit).includes(user.email));
  assert.ok(rows.ea_list_audit.some(event => event.action === 'start' && event.outcome === 'granted'));
  process.env.EARLY_ACCESS_LIST_ENABLED = 'false';
});
test('MOCK list route: exact provider binding rejects cross-provider lookup, forged provider and tampered session', async () => {
  listFixture();
  for (const provider of [undefined, 'patreon', 'unknown']) assert.equal((await supporterListHandler('start', request({ email: user.email, provider }))).status, 400);
  assert.equal((await supporterListHandler('start', request({ email: user.email, provider: 'subscribestar' }))).status, 403);
  const cookies = await listLogin();
  assert.equal((await supporterListHandler('download', request({ releaseId: id, provider: 'subscribestar' }, cookies))).status, 403);
  rows.ea_list_sessions[0].provider = 'subscribestar';
  assert.equal((await supporterListHandler('download', request({ releaseId: id }, cookies))).status, 401);
  process.env.EARLY_ACCESS_LIST_ENABLED = 'false';
});
test('MOCK list route: repeating login rotates the current browser session; denied attempts are audited', async () => {
  listFixture(); const first = await listLogin();
  const again = await supporterListHandler('start', request({ email: user.email, provider: 'boosty' }, first));
  assert.equal(again.status, 200); assert.ok(rows.ea_list_sessions[0].revoked_at);
  assert.equal((await supporterListHandler('download', request({ releaseId: id }, first))).status, 401);
  assert.equal((await supporterListHandler('start', request({ email: 'unknown@example.test', provider: 'boosty' }))).status, 403);
  assert.ok(rows.ea_list_audit.some(event => event.action === 'start' && event.outcome === 'access_denied'));
  assert.ok(!JSON.stringify(rows.ea_list_audit).includes('unknown@example.test'));
  process.env.EARLY_ACCESS_LIST_ENABLED = 'false';
});

const qaOrigin = 'https://sne-qa.vercel.app', qaCookie = '__Host-sne_supporter_list_test';
function qaFixture() {
  listFixture();
  Object.assign(process.env, { EARLY_ACCESS_LIST_ENABLED: 'false', EARLY_ACCESS_LIST_TEST_ENABLED: 'true',
    EARLY_ACCESS_LIST_TEST_PROTECTION_CONFIRMED: 'true', VERCEL: '1', VERCEL_ENV: 'preview',
    VERCEL_URL: 'sne-qa.vercel.app', NODE_ENV: 'production' });
  Object.assign(rows.ea_supporter_list[0], { is_test: true, expires_at: future(), provider_policy: { enabled: false, approval_reference: null } });
}
function qaRequest(body = {}, cookies = {}, method = 'POST', origin = qaOrigin) {
  const req = new Request(origin + '/api/early-access/list/mock', { method,
    headers: { origin, 'content-type': 'application/json' }, ...(method === 'POST' ? { body: JSON.stringify(body) } : {}) });
  req.cookies = { get: name => cookies[name] ? { value: cookies[name] } : undefined }; return req;
}
async function qaLogin() {
  const response = await supporterListHandler('start', qaRequest({ email: user.email, provider: 'boosty' }));
  assert.equal(response.status, 200);
  return { response, cookies: { [qaCookie]: cookie(response, qaCookie) } };
}

test('MOCK QA route: test session persists, expires within access, contains no email in cookie or response, and logs out', async () => {
  qaFixture(); const { response, cookies } = await qaLogin(); const body = await response.json();
  assert.equal(body.status, 'test_active'); assert.equal(body.testMode, true); assert.equal(body.downloadsEnabled, false);
  const stored = rows.ea_list_sessions[0];
  assert.ok(Date.parse(stored.expires_at) <= Date.parse(rows.ea_supporter_list[0].expires_at));
  assert.ok(Date.parse(stored.expires_at) - Date.parse(stored.created_at) <= 600000);
  for (const flag of ['HttpOnly', 'Secure', 'SameSite=strict', 'Path=/']) assert.ok(response.headers.get('set-cookie').includes(flag));
  assert.ok(!JSON.stringify([body, cookies, rows.ea_list_sessions, rows.ea_list_audit]).includes(user.email));
  assert.equal((await (await supporterListHandler('status', qaRequest({}, cookies, 'GET'))).json()).status, 'test_active');
  assert.ok(rows.ea_list_audit.some(r => r.action === 'test_start'));
  assert.equal((await supporterListHandler('logout', qaRequest({}, cookies))).status, 200);
  assert.ok(stored.revoked_at);
  assert.equal((await (await supporterListHandler('status', qaRequest({}, cookies, 'GET'))).json()).status, 'unauthorized');
});

test('MOCK QA route: real rows, unknown email, wrong provider, invalid flags and expired access cannot create sessions', async () => {
  for (const scenario of ['real', 'unknown', 'provider', 'expired', 'flag', 'tier', 'inactive']) {
    qaFixture(); const body = { email: user.email, provider: 'boosty', is_test: true };
    if (scenario === 'real') rows.ea_supporter_list[0].is_test = false;
    if (scenario === 'unknown') body.email = 'unknown@example.test';
    if (scenario === 'provider') body.provider = 'subscribestar';
    if (scenario === 'expired') rows.ea_supporter_list[0].expires_at = '2000-01-01T00:00:00Z';
    if (scenario === 'flag') rows.ea_supporter_list[0].is_test = 'true';
    if (scenario === 'tier') rows.ea_supporter_list[0].subscription_tier = 'Karma Bearer';
    if (scenario === 'inactive') rows.ea_supporter_list[0].status = 'inactive';
    const r = await supporterListHandler('start', qaRequest(body));
    assert.ok(r.status >= 400, scenario); assert.equal(rows.ea_list_sessions?.length ?? 0, 0);
  }
});

test('MOCK QA route: no session or valid session can call Storage/sign/reserve; admin access denied', async () => {
  qaFixture(); const { cookies } = await qaLogin();
  for (const supplied of [{}, cookies]) {
    const r = await supporterListHandler('download', qaRequest({ releaseId: id, provider: 'boosty' }, supplied));
    assert.equal(r.status, 403); assert.deepEqual(await r.json(), { error: 'test_download_disabled' });
  }
  assert.ok(!calls.some(c => ['getBucket', 'fileInfo', 'sign:60', 'reserve_ea_list_download'].includes(c)));
  rows.ea_admins = [{ auth_user_id: id, active: true }];
});

test('MOCK QA route: status rechecks expiry, test flag and revocation; DB failure closes access', async () => {
  for (const scenario of ['expiry', 'flag', 'revocation', 'session-expiry', 'db']) {
    qaFixture(); const { cookies } = await qaLogin();
    if (scenario === 'expiry') rows.ea_supporter_list[0].expires_at = '2000-01-01T00:00:00Z';
    if (scenario === 'flag') rows.ea_supporter_list[0].is_test = false;
    if (scenario === 'revocation') rows.ea_supporter_list[0].status = 'revoked';
    if (scenario === 'session-expiry') rows.ea_list_sessions[0].expires_at = '2000-01-01T00:00:00Z';
    if (scenario === 'db') outage = true;
    const response = await supporterListHandler('status', qaRequest({}, cookies, 'GET'));
    const body = await response.json(); assert.notEqual(body.status, 'test_active');
    if (scenario === 'db') assert.equal(response.status, 503);
  }
});

test('MOCK QA route: renamed QA cookie cannot authorize or revoke a real session; production/alias disabled', async () => {
  qaFixture(); const { cookies } = await qaLogin();
  process.env.EARLY_ACCESS_LIST_TEST_ENABLED = 'false'; process.env.EARLY_ACCESS_LIST_ENABLED = 'true';
  const renamed = { '__Host-sne_supporter_list': cookies[qaCookie] };
  assert.equal((await supporterListHandler('download', request({ releaseId: id }, renamed))).status, 401);
  await supporterListHandler('logout', request({}, renamed)); assert.equal(rows.ea_list_sessions[0].revoked_at, undefined);
  qaFixture(); process.env.VERCEL_ENV = 'production';
  assert.equal((await supporterListHandler('start', qaRequest({ email: user.email, provider: 'boosty' }))).status, 503);
  qaFixture();
  assert.equal((await supporterListHandler('start', qaRequest({ email: user.email, provider: 'boosty' }, {}, 'POST', 'https://shinobinewera.com'))).status, 503);
  assert.equal(rows.ea_list_sessions?.length ?? 0, 0);
});


test('MOCK release contains no email admin or OTP routes; list login never calls Supabase Auth', async () => {
  const { existsSync } = await import('node:fs');
  for (const path of ['app/api/admin/early-access/route.js','app/api/auth/email/start/route.js']) assert.equal(existsSync(path), false);
  listFixture(); await listLogin();
  assert.ok(!calls.includes('verifyOtp'));
  assert.ok(!calls.some(c => typeof c === 'object' && 'send' in c));
  assert.equal(rows.ea_email_sessions?.length ?? 0, 0);
});

test('MOCK SubscribeStar: own eligible list entry creates a bound session; policy/status/tier/expiry remain mandatory', async () => {
  for (const scenario of ['allowed', 'policy-disabled', 'missing-permission', 'expired', 'wrong-tier', 'inactive', 'test-entry']) {
    listFixture(); const entry = rows.ea_supporter_list[0];
    Object.assign(entry, { provider: 'subscribestar', is_test: false, expires_at: future() });
    if (scenario === 'policy-disabled') entry.provider_policy.enabled = false;
    if (scenario === 'missing-permission') entry.provider_policy.approval_reference = null;
    if (scenario === 'expired') entry.expires_at = '2000-01-01T00:00:00Z';
    if (scenario === 'wrong-tier') entry.subscription_tier = 'Karma Bearer';
    if (scenario === 'inactive') entry.status = 'inactive';
    if (scenario === 'test-entry') entry.is_test = true;
    const response = await supporterListHandler('start', request({ email: user.email, provider: 'subscribestar', status: 'active', subscription_tier: 'Resonance Adept' }));
    assert.equal(response.status, scenario === 'allowed' ? 200 : 403, scenario);
    if (scenario !== 'allowed') { assert.equal(rows.ea_list_sessions?.length ?? 0, 0); continue; }
    const cookies = { '__Host-sne_supporter_list': cookie(response, '__Host-sne_supporter_list') };
    const status = await (await supporterListHandler('status', request({}, cookies, undefined, 'GET'))).json();
    assert.equal(status.provider, 'subscribestar'); assert.equal(status.status, 'active'); assert.equal(status.email, undefined);
    assert.equal((await supporterListHandler('download', request({ releaseId: id, provider: 'boosty' }, cookies))).status, 403);
    rows.early_access_releases = [];
    assert.equal((await supporterListHandler('download', request({ releaseId: id }, cookies))).status, 404);
    assert.ok(!calls.includes('sign:60'));
    assert.equal((await supporterListHandler('logout', request({}, cookies))).status, 200);
    assert.equal((await supporterListHandler('download', request({ releaseId: id }, cookies))).status, 401);
  }
});
