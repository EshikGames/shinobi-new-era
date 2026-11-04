import test from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { supporterListConfig, activeListEntries, issueListDownload } from '../lib/early-access/supporter-list-core.mjs';


const now = Date.now(), future = new Date(now + 60000).toISOString();
const active = { provider: 'boosty', subscription_tier: 'Resonance Adept', status: 'active', expires_at: null, provider_policy: { enabled: true, approval_reference: 'mock permission' } };
const env = { EARLY_ACCESS_LIST_ENABLED: 'true', SITE_URL: 'https://example.test', SUPABASE_PROJECT_REF: 'avdkvtmugeizoqqvayek', SUPABASE_URL: 'https://avdkvtmugeizoqqvayek.supabase.co', SUPABASE_SERVICE_ROLE_KEY: 'mock-only', SUPPORTER_TOKEN_ENCRYPTION_KEY: randomBytes(32).toString('base64') };
test('list flow needs no OTP, provider keys or Auth key; only dedicated website config', () => {
  assert.ok(supporterListConfig(env));
  for (const patch of [{ EARLY_ACCESS_LIST_ENABLED: 'false' }, { SUPABASE_PROJECT_REF: 'aymbbkvxtidyxarcesyo' }, { SUPABASE_URL: 'https://aymbbkvxtidyxarcesyo.supabase.co' }, { SUPPORTER_TOKEN_ENCRYPTION_KEY: 'bad' }]) assert.equal(supporterListConfig({ ...env, ...patch }), null);
});

test('MOCK QA config fails closed in production, arbitrary hosts and conflicting modes', () => {
  const preview = { ...env, EARLY_ACCESS_LIST_ENABLED: 'false', EARLY_ACCESS_LIST_TEST_ENABLED: 'true',
    EARLY_ACCESS_LIST_TEST_PROTECTION_CONFIRMED: 'true', VERCEL: '1', VERCEL_ENV: 'preview', VERCEL_URL: 'sne-qa.vercel.app', NODE_ENV: 'production' };
  const c = supporterListConfig(preview);
  assert.equal(c.testMode, true); assert.equal(c.siteOrigin, 'https://sne-qa.vercel.app');
  assert.notDeepEqual(c.encryptionKey, Buffer.from(env.SUPPORTER_TOKEN_ENCRYPTION_KEY, 'base64'));
  for (const patch of [{ VERCEL_ENV: 'production' }, { VERCEL_ENV: '' }, { VERCEL_URL: 'shinobinewera.com' },
    { VERCEL_URL: 'sne.vercel.app.evil.test' }, { EARLY_ACCESS_LIST_TEST_PROTECTION_CONFIRMED: 'false' },
    { EARLY_ACCESS_LIST_ENABLED: 'true' }, { SUPABASE_PROJECT_REF: 'aymbbkvxtidyxarcesyo' }]) {
    assert.equal(supporterListConfig({ ...preview, ...patch }), null);
  }
  const local = { ...env, EARLY_ACCESS_LIST_ENABLED: 'false', EARLY_ACCESS_LIST_TEST_ENABLED: 'true', NODE_ENV: 'development', SITE_URL: 'http://localhost:3011' };
  assert.equal(supporterListConfig(local).testMode, true);
  for (const patch of [{ NODE_ENV: 'production' }, { SITE_URL: 'https://shinobinewera.com' }, { VERCEL_ENV: 'production' }]) assert.equal(supporterListConfig({ ...local, ...patch }), null);
});

test('MOCK QA eligibility requires a finite expiry and exact test flag; never grants real access', () => {
  const row = { ...active, is_test: true, expires_at: future, provider_policy: { enabled: false } };
  assert.equal(activeListEntries([row], now, 'boosty', true).length, 1);
  for (const patch of [{ is_test: false }, { is_test: 'true' }, { expires_at: null }, { expires_at: new Date(now).toISOString() },
    { expires_at: 'invalid' }, { status: 'inactive' }, { subscription_tier: 'Karma Bearer' }, { provider: 'subscribestar' }]) {
    assert.equal(activeListEntries([{ ...row, ...patch }], now, 'boosty', true).length, 0);
  }
  assert.equal(activeListEntries([{ ...row, provider_policy: active.provider_policy }], now, 'boosty').length, 0);
});
test('list entries require an exact allowed tier, active status, expiry and approved platform', () => {
  assert.equal(activeListEntries([active], now, 'boosty').length, 1);
  for (const subscription_tier of ['Resonance Adept', 'Otsutsuki Chosen', 'New Era Architect']) assert.equal(activeListEntries([{ ...active, subscription_tier }], now, 'boosty').length, 1);
  for (const subscription_tier of ['Karma Bearer', 'resonance adept', 'Resonance Adept ', 'unknown']) assert.equal(activeListEntries([{ ...active, subscription_tier }], now, 'boosty').length, 0);
  for (const provider_policy of [null, {}, { enabled: true }, { enabled: true, approval_reference: ' ' }, { enabled: false, approval_reference: 'mock' }]) assert.equal(activeListEntries([{ ...active, provider_policy }], now, 'boosty').length, 0);
  for (const patch of [{ status: 'inactive' }, { status: 'revoked' }, { status: 'unknown' }, { provider: 'unknown' }, { expires_at: new Date(now - 1).toISOString() }, { expires_at: 'invalid' }, { subscription_tier: '' }]) assert.equal(activeListEntries([{ ...active, ...patch }], now, 'boosty').length, 0);
  assert.equal(activeListEntries([{ ...active, status: 'revoked' }, { ...active, provider: 'subscribestar' }], now, 'boosty').length, 0);
});
function options() {
  const calls = [];
  return { calls, session: { expires_at: future, provider: 'boosty' }, now,
    lookup: async () => { calls.push('lookup'); return [active]; },
    loadRelease: async () => ({ id: 'mock', storage_bucket: 'early-access-builds', object_path: 'mock.zip', unlock_at: new Date(now - 1000).toISOString(), is_published: true, list_rules: { public_release_at: new Date(now - 1000 + 14 * 86400000).toISOString(), allowed_tiers: ['Resonance Adept'] } }),
    fileExists: async () => { calls.push('file'); return true; },
    sign: async (_r, ttl) => { calls.push(`sign:${ttl}`); return 'https://mock.invalid/signed'; },
    reserve: async () => { calls.push('reserve'); } };
}
test('mock list download checks status and signs for 60 seconds with final reservation', async () => {
  const o = options(); assert.equal((await issueListDownload(o)).expiresIn, 60); assert.deepEqual(o.calls, ['lookup', 'file', 'sign:60', 'reserve']);
});
test('missing session, expired session, inactive email and unpublished/locked releases deny', async () => {
  for (const patch of [{ session: null }, { session: { expires_at: '2000-01-01', revoked_at: null } }, { session: { expires_at: future, revoked_at: future } },
    { lookup: async () => [] }, { lookup: async () => [{ ...active, subscription_tier: 'Karma Bearer' }] }, { lookup: async () => [{ ...active, provider_policy: { enabled: false } }] },
    { loadRelease: async () => null }, { loadRelease: async () => ({ storage_bucket: 'early-access-builds', object_path: 'mock.zip', is_published: true, unlock_at: future }) }]) {
    const o = options(); await assert.rejects(issueListDownload({ ...o, ...patch })); assert.ok(!o.calls.includes('sign:60'));
  }
});
test('DB/Storage failure or concurrent revoke at reservation never returns a URL', async () => {
  for (const patch of [{ lookup: async () => { throw new Error('db unavailable'); } }, { fileExists: async () => false }, { reserve: async () => { throw new Error('revoked'); } }]) await assert.rejects(issueListDownload({ ...options(), ...patch }));
});
