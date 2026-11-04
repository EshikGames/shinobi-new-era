import { createHmac } from 'node:crypto';
import { isEarlyAccessSupabaseTarget } from './project.mjs';
import { ManualError, normalizeEmail } from './list-primitives.mjs';

export { normalizeEmail };
// Exact owner-confirmed 14-day tiers; never trust a tier submitted by the browser.
export const LIST_ALLOWED_TIERS = Object.freeze(['Resonance Adept', 'Otsutsuki Chosen', 'New Era Architect']);
// Each platform still requires its own enabled, documented database policy.
export const LIST_PROVIDERS = Object.freeze(['boosty', 'subscribestar']);
// Owner supplied these exact platform IDs; they are not fetched or inferred from email.
export const LIST_TIER_MAP = Object.freeze({
  boosty: { 'Resonance Adept': '4120922', 'Otsutsuki Chosen': '4120933', 'New Era Architect': '4120947' },
  subscribestar: { 'Resonance Adept': '149740', 'Otsutsuki Chosen': '149741', 'New Era Architect': '149742' },
});
export function listPlatformApproved(policy) {
  return policy?.enabled === true && typeof policy.approval_reference === 'string' && Boolean(policy.approval_reference.trim());
}
export function supporterListConfig(env) {
  const testMode = env.EARLY_ACCESS_LIST_TEST_ENABLED === 'true';
  if (!testMode && env.EARLY_ACCESS_LIST_ENABLED !== 'true') return null;
  // Ambiguous configuration must never fall back to real access.
  if (testMode && env.EARLY_ACCESS_LIST_ENABLED === 'true') return null;
  try {
    if (!isEarlyAccessSupabaseTarget(env.SUPABASE_PROJECT_REF, env.SUPABASE_URL)) return null;
    let origin = env.SITE_URL;
    if (testMode) {
      if (env.VERCEL === '1') {
        // Operator must first verify Vercel Authentication protects the Preview.
        if (env.VERCEL_ENV !== 'preview' || env.EARLY_ACCESS_LIST_TEST_PROTECTION_CONFIRMED !== 'true' ||
          !/^[a-z0-9-]+\.vercel\.app$/.test(env.VERCEL_URL ?? '')) return null;
        origin = `https://${env.VERCEL_URL}`;
      } else if (env.VERCEL_ENV || env.NODE_ENV !== 'development' ||
        !/^http:\/\/localhost(?::\d+)?\/?$/.test(origin ?? '')) return null;
    }
    const site = new URL(origin), encoded = env.SUPPORTER_TOKEN_ENCRYPTION_KEY;
    if (site.username || site.password || site.pathname !== '/' || site.search || site.hash) return null;
    if (site.protocol !== 'https:' && !(env.NODE_ENV !== 'production' && site.protocol === 'http:' && site.hostname === 'localhost')) return null;
    if (!/^[A-Za-z0-9+/]{43}=$/.test(encoded ?? '')) return null;
    const key = Buffer.from(encoded, 'base64');
    if (key.length !== 32 || key.toString('base64') !== encoded || !env.SUPABASE_SERVICE_ROLE_KEY) return null;
    // Separate cryptographic domain prevents a QA token from becoming a real session,
    // even if its cookie is renamed or the same database and master key are used.
    const encryptionKey = testMode ? createHmac('sha256', key).update(`sne-list-test-v1:${site.origin}`).digest() : key;
    return { siteOrigin: site.origin, secureCookie: site.protocol === 'https:', encryptionKey, testMode,
      projectRef: env.SUPABASE_PROJECT_REF, supabaseUrl: env.SUPABASE_URL, supabaseKey: env.SUPABASE_SERVICE_ROLE_KEY,
      bucket: 'early-access-builds' };
  } catch { return null; }
}
export function activeListEntries(rows, now = Date.now(), provider, testMode = false) {
  if (!LIST_PROVIDERS.includes(provider) || !Array.isArray(rows) || rows.length !== 1) return [];
  return rows.filter(row => row.provider === provider && row.status === 'active' &&
    Object.hasOwn(LIST_TIER_MAP[provider], row.subscription_tier) &&
    (testMode ? provider === 'boosty' && row.is_test === true && Number.isFinite(Date.parse(row.expires_at))
      : row.is_test !== true && listPlatformApproved(row.provider_policy)) &&
    (row.expires_at === null || Date.parse(row.expires_at) > now));
}
export function listAccessView(entry, session, testMode = false) {
  return { status: testMode ? 'test_active' : 'active', testMode, downloadsEnabled: !testMode,
    identityVerified: false, provider: session.provider,
    tier: entry.subscription_tier, accessExpiresAt: entry.expires_at, sessionExpiresAt: session.expires_at };
}
export function listReleaseAllowed(release, tier) {
  const rules = release?.list_rules;
  return Boolean(rules && Date.parse(rules.public_release_at) - Date.parse(release.unlock_at) === 14 * 86400000 &&
    Array.isArray(rules.allowed_tiers) && rules.allowed_tiers.includes(tier));
}
export async function issueListDownload({ session, lookup, loadRelease, fileExists, sign, reserve, now = Date.now() }) {
  if (!session || session.revoked_at || !(Date.parse(session.expires_at) > now)) throw new ManualError('unauthorized', 401);
  const entry = activeListEntries(await lookup(), now, session.provider)[0];
  if (!entry) throw new ManualError('access_denied');
  const release = await loadRelease();
  if (!release?.is_published || release.storage_bucket !== 'early-access-builds' || !release.object_path || !Number.isFinite(Date.parse(release.unlock_at))) throw new ManualError('release_not_found', 404);
  if (Date.parse(release.unlock_at) > now) throw new ManualError('release_locked', 423);
  if (!listReleaseAllowed(release, entry.subscription_tier)) throw new ManualError('access_denied');
  if (!(await fileExists(release))) throw new ManualError('file_unavailable', 503);
  const url = await sign(release, 60);
  if (!url) throw new ManualError('file_unavailable', 503);
  // The reservation rechecks list status, expiry, session and release atomically after signing.
  await reserve(release);
  return { url, expiresIn: 60 };
}
