import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import test from "node:test";
import { completePatreonOAuth, OAuthFlowError } from "../lib/early-access/oauth-flow.mjs";
import { issueProtectedDownload, DownloadFlowError } from "../lib/early-access/download-flow.mjs";
import { verifyStoredPatreonAccount } from "../lib/early-access/entitlement-core.mjs";
import { resolveSupporterSession } from "../lib/early-access/session-core.mjs";
import { evaluatePatreonIdentity, exchangePatreonCode, fetchPatreonIdentity } from "../lib/early-access/patreon.mjs";
import { encryptToken, decryptToken, randomToken, tokenHash } from "../lib/early-access/security.mjs";

const campaignId = "mock-campaign";
const tierId = "mock-tier";
const releaseId = "00000000-0000-4000-8000-000000000001";
const bucket = "early-access-builds";
const config = { campaignId, allowedTierIds: [tierId], bucket, encryptionKey: randomBytes(32) };

function memberPayload(status = "active_patron", campaign = campaignId, tier = tierId, userId = "mock-user") {
  return {
    data: { type: "user", id: userId },
    included: [{ type: "member", id: "mock-membership", attributes: { patron_status: status },
      relationships: { campaign: { data: { type: "campaign", id: campaign } },
        currently_entitled_tiers: { data: [{ type: "tier", id: tier }] } } }],
  };
}

function mockOAuth(overrides = {}) {
  const state = randomToken();
  let consumed = false;
  const calls = { exchanged: 0, stored: 0, sessions: 0, audited: 0 };
  const args = {
    suppliedState: state, cookieState: state, code: "mock-code",
    consumeState: async (hash) => {
      assert.equal(hash, tokenHash(state));
      if (consumed) return false;
      consumed = true;
      return true;
    },
    exchangeCode: async (code) => {
      calls.exchanged += 1;
      assert.equal(code, "mock-code");
      return { access_token: "mock-access", refresh_token: "mock-refresh", expires_in: 3600 };
    },
    fetchIdentity: async (token) => {
      assert.equal(token, "mock-access");
      return evaluatePatreonIdentity(memberPayload(), campaignId, [tierId]);
    },
    storeAccount: async (identity, tokens) => {
      calls.stored += 1;
      assert.equal(identity.providerUserId, "mock-user");
      assert.equal(tokens.refresh_token, "mock-refresh");
      return "mock-account";
    },
    createSession: async (accountId) => {
      calls.sessions += 1;
      assert.equal(accountId, "mock-account");
      return randomToken();
    },
    auditSuccess: async (accountId) => {
      calls.audited += 1;
      assert.equal(accountId, "mock-account");
    },
    ...overrides,
  };
  return { args, calls };
}

function mockDownload(overrides = {}) {
  const calls = { verified: 0, loaded: 0, signed: 0, grants: 0, audited: [] };
  const release = {
    id: releaseId, is_published: true, storage_bucket: bucket, object_path: "private/mock-build.zip",
    unlock_at: new Date(Date.now() - 60_000).toISOString(), allowed_tier_ids: [tierId],
  };
  const args = {
    session: { account_id: "mock-account" }, releaseId, campaignId, allowedTierIds: [tierId], bucket,
    verifyIdentity: async (accountId) => {
      calls.verified += 1;
      assert.equal(accountId, "mock-account");
      return evaluatePatreonIdentity(memberPayload(), campaignId, [tierId]);
    },
    loadRelease: async (id) => {
      calls.loaded += 1;
      assert.equal(id, releaseId);
      return release;
    },
    signUrl: async (name, path, seconds) => {
      calls.signed += 1;
      assert.deepEqual([name, path, seconds], [bucket, release.object_path, 60]);
      return "https://mock-storage.invalid/signed";
    },
    saveGrant: async (accountId, id, seconds) => {
      calls.grants += 1;
      assert.deepEqual([accountId, id, seconds], ["mock-account", releaseId, 60]);
    },
    audit: async (outcome) => { calls.audited.push(outcome); },
    ...overrides,
  };
  return { args, calls, release };
}

test("mock OAuth completes only after state, identity, account, session, and audit", async () => {
  const { args, calls } = mockOAuth();
  const result = await completePatreonOAuth(args);
  assert.equal(result.accountId, "mock-account");
  assert.equal(result.sessionToken.length, 43);
  assert.deepEqual(calls, { exchanged: 1, stored: 1, sessions: 1, audited: 1 });
});

test("replayed or changed OAuth state never exchanges a second code", async () => {
  const { args, calls } = mockOAuth();
  await completePatreonOAuth(args);
  await assert.rejects(completePatreonOAuth(args), (error) => error instanceof OAuthFlowError && error.code === "expired_or_reused_state");
  await assert.rejects(completePatreonOAuth({ ...args, cookieState: randomToken() }), (error) => error instanceof OAuthFlowError && error.code === "invalid_callback");
  assert.equal(calls.exchanged, 1);
});

test("Supabase state failure and Patreon outage stop mock OAuth before session creation", async () => {
  const dbFailure = mockOAuth({ consumeState: async () => { throw new Error("Supabase unavailable"); } });
  await assert.rejects(completePatreonOAuth(dbFailure.args), /Supabase unavailable/);
  assert.equal(dbFailure.calls.exchanged, 0);
  const providerFailure = mockOAuth({ exchangeCode: async () => { throw new Error("Patreon unavailable"); } });
  await assert.rejects(completePatreonOAuth(providerFailure.args), /Patreon unavailable/);
  assert.equal(providerFailure.calls.sessions, 0);
});

test("Patreon identity request uses membership scope data and fails closed on API error", async () => {
  const requester = async (url, options) => {
    assert.equal(url.searchParams.get("include"), "memberships.campaign,memberships.currently_entitled_tiers");
    assert.equal(url.searchParams.get("fields[member]"), "patron_status");
    assert.equal(options.headers.Authorization, "Bearer mock-access");
    return { ok: true, json: async () => memberPayload() };
  };
  assert.equal((await fetchPatreonIdentity(config, "mock-access", requester)).active, true);
  await assert.rejects(fetchPatreonIdentity(config, "mock-access", async () => ({ ok: false })), /Patreon identity request failed/);
});

test("malformed Patreon OAuth token response cannot create a session", async () => {
  const oauthConfig = { patreonClientId: "mock-client", patreonClientSecret: "mock-secret", callbackUrl: "https://example.invalid/callback" };
  const invalidResponse = async () => ({ ok: true, json: async () => ({ access_token: "access", refresh_token: "refresh", expires_in: 0 }) });
  await assert.rejects(exchangePatreonCode(oauthConfig, "mock-code", invalidResponse), /Invalid Patreon token response/);
  const denied = mockOAuth({ code: null });
  await assert.rejects(completePatreonOAuth(denied.args), (error) => error instanceof OAuthFlowError && error.code === "invalid_callback");
  assert.equal(denied.calls.exchanged, 0);
});

test("expired token is refreshed, encrypted, and bound to the original Patreon user", async () => {
  const account = { provider: "patreon", provider_user_id: "mock-user",
    access_token_encrypted: encryptToken("old-access", config.encryptionKey),
    refresh_token_encrypted: encryptToken("old-refresh", config.encryptionKey),
    token_expires_at: new Date(Date.now() - 1000).toISOString() };
  let saved;
  const identity = await verifyStoredPatreonAccount(account, config, {
    refreshToken: async (token) => {
      assert.equal(token, "old-refresh");
      return { access_token: "new-access", refresh_token: "new-refresh", expires_in: 3600 };
    },
    saveTokens: async (values) => { saved = values; },
    fetchIdentity: async (token) => {
      assert.equal(token, "new-access");
      return evaluatePatreonIdentity(memberPayload(), campaignId, [tierId]);
    },
  });
  assert.equal(identity.active, true);
  assert.equal(decryptToken(saved.access_token_encrypted, config.encryptionKey), "new-access");
  assert.equal(decryptToken(saved.refresh_token_encrypted, config.encryptionKey), "new-refresh");
  assert.ok(!JSON.stringify(saved).includes("new-refresh"));
  await assert.rejects(verifyStoredPatreonAccount(account, config, {
    refreshToken: async () => { throw new Error("refresh rejected"); },
    saveTokens: async () => { throw new Error("must not save"); },
    fetchIdentity: async () => { throw new Error("must not fetch"); },
  }), /refresh rejected/);
});

test("Patreon user ID change is rejected even with an otherwise active tier", async () => {
  const account = { provider: "patreon", provider_user_id: "original-user",
    access_token_encrypted: encryptToken("access", config.encryptionKey),
    refresh_token_encrypted: encryptToken("refresh", config.encryptionKey),
    token_expires_at: new Date(Date.now() + 3600_000).toISOString() };
  await assert.rejects(verifyStoredPatreonAccount(account, config, {
    refreshToken: async () => { throw new Error("unexpected refresh"); },
    saveTokens: async () => { throw new Error("unexpected save"); },
    fetchIdentity: async () => evaluatePatreonIdentity(memberPayload("active_patron", campaignId, tierId, "different-user"), campaignId, [tierId]),
  }), /Patreon identity mismatch/);
});

test("corrupt, expired, revoked, and unknown session cookies do not resolve", async () => {
  const token = randomToken();
  const valid = { account_id: "mock-account", expires_at: new Date(Date.now() + 60_000).toISOString(), revoked_at: null };
  const lookup = async (hash) => hash === tokenHash(token) ? valid : null;
  assert.equal((await resolveSupporterSession(token, lookup)).account_id, "mock-account");
  assert.equal(await resolveSupporterSession(token.slice(1), lookup), null);
  assert.equal(await resolveSupporterSession(randomToken(), lookup), null);
  assert.equal(await resolveSupporterSession(token, async () => ({ ...valid, revoked_at: new Date().toISOString() })), null);
  assert.equal(await resolveSupporterSession(token, async () => ({ ...valid, expires_at: new Date(Date.now() - 1000).toISOString() })), null);
  await assert.rejects(resolveSupporterSession(token, async () => { throw new Error("Supabase unavailable"); }), /Supabase unavailable/);
});

test("mock signed URL is issued only after a valid session and active membership", async () => {
  const { args, calls } = mockDownload();
  assert.deepEqual(await issueProtectedDownload(args), { url: "https://mock-storage.invalid/signed", expiresIn: 60 });
  assert.deepEqual([calls.verified, calls.loaded, calls.signed, calls.grants], [1, 1, 1, 1]);
  assert.deepEqual(calls.audited, ["granted"]);
  const anonymous = mockDownload({ session: null });
  await assert.rejects(issueProtectedDownload(anonymous.args), (error) => error instanceof DownloadFlowError && error.status === 401);
  assert.equal(anonymous.calls.signed, 0);
  const inactive = mockDownload({ verifyIdentity: async () => evaluatePatreonIdentity(memberPayload("former_patron"), campaignId, [tierId]) });
  await assert.rejects(issueProtectedDownload(inactive.args), (error) => error instanceof DownloadFlowError && error.status === 403);
  assert.equal(inactive.calls.signed, 0);
});

test("wrong campaign, tier, or future unlock prevents signing", async () => {
  for (const payload of [memberPayload("active_patron", "other-campaign"), memberPayload("active_patron", campaignId, "other-tier")]) {
    const denied = mockDownload({ verifyIdentity: async () => evaluatePatreonIdentity(payload, campaignId, [tierId]) });
    await assert.rejects(issueProtectedDownload(denied.args), (error) => error instanceof DownloadFlowError && error.status === 403);
    assert.equal(denied.calls.signed, 0);
  }
  const forgedCampaign = mockDownload({ verifyIdentity: async () => ({ active: true, campaignId: "other-campaign", patronStatus: "active_patron", tierIds: [tierId] }) });
  await assert.rejects(issueProtectedDownload(forgedCampaign.args), (error) => error instanceof DownloadFlowError && error.status === 403);
  assert.equal(forgedCampaign.calls.signed, 0);
  const locked = mockDownload();
  locked.release.unlock_at = new Date(Date.now() + 3600_000).toISOString();
  await assert.rejects(issueProtectedDownload(locked.args), (error) => error instanceof DownloadFlowError && error.status === 423);
  assert.equal(locked.calls.signed, 0);
  const providerDown = mockDownload({ verifyIdentity: async () => { throw new Error("Patreon unavailable"); } });
  await assert.rejects(issueProtectedDownload(providerDown.args), /Patreon unavailable/);
  assert.equal(providerDown.calls.signed, 0);
});

test("Storage signing and grant failures never return a download URL", async () => {
  const signingDown = mockDownload({ signUrl: async () => { throw new Error("Storage unavailable"); } });
  await assert.rejects(issueProtectedDownload(signingDown.args), /Storage unavailable/);
  assert.equal(signingDown.calls.grants, 0);
  const grantDown = mockDownload({ saveGrant: async () => { throw new Error("Supabase unavailable"); } });
  await assert.rejects(issueProtectedDownload(grantDown.args), /Supabase unavailable/);
  assert.equal(grantDown.calls.signed, 1);
});
