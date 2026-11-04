import 'server-only';
import { createEarlyAccessDb, consumeRateLimit } from './db';
import { privateJson, sameOrigin } from './response';
import { randomToken, tokenHash, encryptToken, decryptToken, pseudonymousKey } from './security.mjs';
import { ManualError, TOKEN, UUID } from './list-primitives.mjs';
import { supporterListConfig, normalizeEmail, activeListEntries, issueListDownload, LIST_PROVIDERS, listAccessView } from './supporter-list-core.mjs';

const cookieName = c => `${c.secureCookie ? '__Host-' : ''}sne_supporter_list${c.testMode ? '_test' : ''}`;
const cookieOptions = (c, maxAge) => ({ httpOnly: true, secure: c.secureCookie, sameSite: 'strict', path: '/', maxAge });
async function checked(query) { const { data, error } = await query; if (error) throw new ManualError('service_unavailable', 503); return data; }
async function limited(db, c, key, hits, seconds) {
  if (!(await consumeRateLimit(db, pseudonymousKey(`list:${key}`, c.encryptionKey), hits, seconds))) throw new ManualError('rate_limited', 429);
}
async function bodyOf(request) {
  const reader = request.body?.getReader(); if (!reader) throw new ManualError('invalid_request', 400);
  let size = 0; const chunks = [];
  for (;;) { const { value, done } = await reader.read(); if (done) break; size += value.length;
    if (size > 1024) { await reader.cancel(); throw new ManualError('invalid_request', 400); } chunks.push(Buffer.from(value)); }
  try { const body = JSON.parse(Buffer.concat(chunks).toString()); if (!body || Array.isArray(body) || typeof body !== 'object') throw new Error(); return body; }
  catch { throw new ManualError('invalid_request', 400); }
}
function lookup(db, email, provider) {
  return checked(db.from('ea_supporter_list').select('provider,subscription_tier,status,expires_at,is_test,provider_policy:ea_list_provider_policies!inner(enabled,approval_reference)').eq('email', email).eq('provider', provider).limit(2));
}
async function readSession(request, db, c) {
  const token = request.cookies.get(cookieName(c))?.value;
  if (!TOKEN.test(token ?? '')) throw new ManualError('unauthorized', 401);
  const row = await checked(db.from('ea_list_sessions').select('*').eq('token_hash', tokenHash(token)).maybeSingle());
  if (!row || row.revoked_at || !(Date.parse(row.expires_at) > Date.now())) throw new ManualError('unauthorized', 401);
  let claimedEmail;
  try { claimedEmail = decryptToken(row.email_encrypted, c.encryptionKey); }
  catch { throw new ManualError('unauthorized', 401); }
  if (!LIST_PROVIDERS.includes(row.provider) || normalizeEmail(claimedEmail) !== claimedEmail || pseudonymousKey(`list-subject:${row.provider}:${claimedEmail}`, c.encryptionKey) !== row.subject_hash) throw new ManualError('unauthorized', 401);
  return { ...row, claimedEmail };
}
async function revokeCurrent(request, db, c) {
  let session;
  try { session = await readSession(request, db, c); }
  catch (error) { if (error.status === 401) return; throw error; }
  await checked(db.from('ea_list_sessions').update({ revoked_at: new Date().toISOString() })
    .eq('token_hash', session.token_hash).eq('subject_hash', session.subject_hash));
}
export async function supporterListHandler(action, request) {
  const c = supporterListConfig(process.env);
  if (!c) return privateJson(action === 'status' ? { enabled: false, status: 'unavailable' } : { error: 'unavailable' }, action === 'status' ? 200 : 503);
  // Preview aliases (including a promoted production alias) cannot expose the QA API.
  if (c.testMode && new URL(request.url).origin !== c.siteOrigin) return privateJson({ error: 'unavailable' }, 503);
  let db, subject = null;
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const log = async outcome => {
    // Bound rejected-attempt log volume; accepted actions must always be recorded.
    if (!['granted', 'signed_out'].includes(outcome) && !(await consumeRateLimit(db, pseudonymousKey(`list:audit:${ip}`, c.encryptionKey), 30, 60))) return;
    await checked(db.from('ea_list_audit').insert({ action: c.testMode ? `test_${action}` : action, outcome, subject_hash: subject }));
  };
  try {
    db = createEarlyAccessDb(c);
    if (request.method === 'POST' && (!sameOrigin(request, c.siteOrigin) || request.headers.get('sec-fetch-site') === 'cross-site' || !/^application\/json(?:;|$)/i.test(request.headers.get('content-type') ?? ''))) throw new ManualError('invalid_request');
    // No test session, release ID or provider can reach Storage or reservation code.
    if (c.testMode && action === 'download') throw new ManualError('test_download_disabled');
    if (action === 'start') {
      await limited(db, c, 'start:global', 100, 60);
      await limited(db, c, `start:ip:${ip}`, 5, 600);
    }
    const body = request.method === 'POST' ? await bodyOf(request) : {};
    if (action === 'start') {
      const email = normalizeEmail(body.email); if (!email) throw new ManualError('invalid_email', 400);
      const provider = body.provider; if (!LIST_PROVIDERS.includes(provider) || (c.testMode && provider !== 'boosty')) throw new ManualError('invalid_provider', 400);
      subject = pseudonymousKey(`list-subject:${provider}:${email}`, c.encryptionKey);
      await limited(db, c, `start:email:${email}`, 5, 600);
      const entry = activeListEntries(await lookup(db, email, provider), Date.now(), provider, c.testMode)[0];
      if (!entry) throw new ManualError('access_denied');
      const token = randomToken(), now = Date.now();
      await revokeCurrent(request, db, c);
      const expires = c.testMode ? Math.min(now + 600000, Date.parse(entry.expires_at)) : now + 1800000;
      if (expires <= now) throw new ManualError('access_denied');
      const session = { token_hash: tokenHash(token), email_encrypted: encryptToken(email, c.encryptionKey), provider,
        subject_hash: subject, created_at: new Date(now).toISOString(), expires_at: new Date(expires).toISOString() };
      await checked(db.from('ea_list_sessions').insert(session));
      await log('granted');
      const response = privateJson(listAccessView(entry, session, c.testMode));
      response.cookies.set(cookieName(c), token, cookieOptions(c, Math.floor((expires - now) / 1000))); return response;
    }
    if (action === 'logout') {
      await revokeCurrent(request, db, c);
      await log('signed_out');
      const response = privateJson({ status: 'signed_out' }); response.cookies.set(cookieName(c), '', cookieOptions(c, 0)); return response;
    }
    let session;
    try { session = await readSession(request, db, c); }
    catch (error) { if (action === 'status' && error.status === 401) return privateJson({ enabled: true, status: 'unauthorized', testMode: c.testMode, downloadsEnabled: !c.testMode }); throw error; }
    subject = session.subject_hash;
    if (body.provider !== undefined && body.provider !== session.provider) throw new ManualError('invalid_provider');
    await limited(db, c, `${action}:${session.subject_hash}`, action === 'download' ? 10 : 30, 60);
    // Only the selected session's access summary; never email, list rows, IDs or approval references.
    if (action === 'status') {
      const entry = activeListEntries(await lookup(db, session.claimedEmail, session.provider), Date.now(), session.provider, c.testMode)[0];
      return privateJson(entry ? { enabled: true, ...listAccessView(entry, session, c.testMode) } : { enabled: true, status: 'expired', identityVerified: false, testMode: c.testMode, downloadsEnabled: !c.testMode });
    }
    if (action !== 'download' || !UUID.test(body.releaseId ?? '')) throw new ManualError('invalid_request', 400);
    const result = await issueListDownload({ session, lookup: () => lookup(db, session.claimedEmail, session.provider),
      loadRelease: () => checked(db.from('early_access_releases').select('id,storage_bucket,object_path,unlock_at,is_published,list_rules:ea_list_release_rules(public_release_at,allowed_tiers)').eq('id', body.releaseId).maybeSingle()),
      fileExists: async release => { const bucket = await db.storage.getBucket(c.bucket); if (bucket.error || bucket.data?.public !== false) return false;
        const file = await db.storage.from(c.bucket).info(release.object_path); return !file.error && Boolean(file.data); },
      sign: async (release, seconds) => (await checked(db.storage.from(c.bucket).createSignedUrl(release.object_path, seconds, { download: true })))?.signedUrl,
      reserve: release => checked(db.rpc('reserve_ea_list_download', { p_session_hash: session.token_hash, p_subject_hash: session.subject_hash, p_email: session.claimedEmail, p_release: release.id, p_object_path: release.object_path })),
    });
    await log('granted');
    return privateJson(result);
  } catch (error) {
    const code = error instanceof ManualError ? error.code : 'service_unavailable';
    try { if (db) await log(code); } catch { return privateJson({ error: 'service_unavailable' }, 503); }
    return privateJson({ error: code }, error instanceof ManualError ? error.status : 503);
  }
}
