import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import test from "node:test";
import { decryptToken, encryptToken, randomToken, safeTokenEqual, tokenHash } from "../lib/early-access/security.mjs";
import { evaluatePatreonIdentity, patreonAuthorizationUrl } from "../lib/early-access/patreon.mjs";
import { consumeOAuthState } from "../lib/early-access/oauth-state.mjs";
import { isSessionCurrent } from "../lib/early-access/session-validity.mjs";
import { releaseAccessDecision } from "../lib/early-access/release-access.mjs";

const campaignId = "creator-campaign";
const allowed = ["paid-tier"];

function identity(status = "active_patron", campaign = campaignId, tier = "paid-tier") {
  return {
    data: { type: "user", id: "patreon-user" },
    included: [{
      type: "member", id: "member-id",
      attributes: { patron_status: status, email: "same@example.test" },
      relationships: {
        campaign: { data: { type: "campaign", id: campaign } },
        currently_entitled_tiers: { data: [{ type: "tier", id: tier }] },
      },
    }],
  };
}

test("Patreon access requires the expected campaign, active status, and allowed tier", () => {
  assert.equal(evaluatePatreonIdentity(identity(), campaignId, allowed).active, true);
  assert.equal(evaluatePatreonIdentity(identity("declined_patron"), campaignId, allowed).active, false);
  assert.equal(evaluatePatreonIdentity(identity("former_patron"), campaignId, allowed).active, false);
  assert.equal(evaluatePatreonIdentity(identity("active_patron", "other-campaign"), campaignId, allowed).active, false);
  assert.equal(evaluatePatreonIdentity(identity("active_patron", campaignId, "free-tier"), campaignId, allowed).active, false);
  assert.equal(evaluatePatreonIdentity({ data: { type: "user", id: "patreon-user", attributes: { email: "same@example.test" } } }, campaignId, allowed).active, false);
});

test("OAuth state is random and matched without accepting missing or changed values", () => {
  const first = randomToken();
  const second = randomToken();
  assert.notEqual(first, second);
  assert.equal(safeTokenEqual(first, first), true);
  assert.equal(safeTokenEqual(first, second), false);
  assert.equal(safeTokenEqual(first, undefined), false);
  assert.equal(tokenHash(first).length, 64);
  const url = new URL(patreonAuthorizationUrl({ patreonClientId: "client", callbackUrl: "https://example.test/api/auth/patreon/callback" }, first));
  assert.equal(url.searchParams.get("state"), first);
  assert.equal(url.searchParams.get("response_type"), "code");
  assert.equal(url.searchParams.get("scope"), "identity identity.memberships");
});

test("OAuth state is accepted once when the atomic database function reports consumption", async () => {
  let used = false;
  const db = { rpc: async () => {
    if (used) return { data: false, error: null };
    used = true;
    return { data: true, error: null };
  } };
  assert.equal(await consumeOAuthState(db, "state-hash"), true);
  assert.equal(await consumeOAuthState(db, "state-hash"), false);
});

test("Patreon tokens are encrypted at rest and tampering is rejected", () => {
  const key = randomBytes(32);
  const stored = encryptToken("refresh-secret", key);
  assert.ok(!stored.includes("refresh-secret"));
  assert.equal(decryptToken(stored, key), "refresh-secret");
  assert.throws(() => decryptToken(stored, randomBytes(32)));
});

test("expired, revoked, or malformed sessions cannot authorize requests", () => {
  const now = Date.now();
  assert.equal(isSessionCurrent({ expires_at: new Date(now + 60_000).toISOString(), revoked_at: null }, now), true);
  assert.equal(isSessionCurrent({ expires_at: new Date(now - 1).toISOString(), revoked_at: null }, now), false);
  assert.equal(isSessionCurrent({ expires_at: new Date(now + 60_000).toISOString(), revoked_at: new Date().toISOString() }, now), false);
  assert.equal(isSessionCurrent({ expires_at: "invalid", revoked_at: null }, now), false);
});

test("private release grants require an unlocked build and matching tier", () => {
  const now = Date.now();
  const account = { active: true, tierIds: ["paid-tier"] };
  const release = { is_published: true, storage_bucket: "early-access-builds", unlock_at: new Date(now - 1).toISOString(), allowed_tier_ids: ["paid-tier"] };
  assert.equal(releaseAccessDecision(account, release, allowed, "early-access-builds", now), "allowed");
  assert.equal(releaseAccessDecision({ ...account, active: false }, release, allowed, "early-access-builds", now), "inactive");
  assert.equal(releaseAccessDecision(account, { ...release, unlock_at: new Date(now + 60_000).toISOString() }, allowed, "early-access-builds", now), "locked");
  assert.equal(releaseAccessDecision(account, { ...release, allowed_tier_ids: ["other-tier"] }, allowed, "early-access-builds", now), "tier_denied");
  assert.equal(releaseAccessDecision(account, { ...release, storage_bucket: "public" }, allowed, "early-access-builds", now), "missing");
});
