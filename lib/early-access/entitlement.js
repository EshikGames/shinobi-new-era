import "server-only";
import { decryptToken, encryptToken, safeTokenEqual } from "./security.mjs";
import { fetchPatreonIdentity, refreshPatreonToken } from "./patreon.mjs";

export async function storePatreonAccount(db, config, identity, tokens) {
  const expiresAt = new Date(Date.now() + Number(tokens.expires_in) * 1000).toISOString();
  const { data, error } = await db.from("supporter_accounts").upsert({
    provider: "patreon",
    provider_user_id: identity.providerUserId,
    access_token_encrypted: encryptToken(tokens.access_token, config.encryptionKey),
    refresh_token_encrypted: encryptToken(tokens.refresh_token, config.encryptionKey),
    token_expires_at: expiresAt,
    updated_at: new Date().toISOString(),
  }, { onConflict: "provider,provider_user_id" }).select("id").single();
  if (error || !data) throw new Error("Supporter account save failed");
  await storeEntitlement(db, data.id, identity);
  return data.id;
}

async function storeEntitlement(db, accountId, identity) {
  const { error } = await db.from("supporter_entitlements").upsert({
    account_id: accountId,
    provider: "patreon",
    campaign_id: identity.campaignId,
    patron_status: identity.patronStatus,
    tier_ids: identity.tierIds,
    verified_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }, { onConflict: "account_id,provider,campaign_id" });
  if (error) throw new Error("Entitlement save failed");
}

export async function verifyLivePatreonEntitlement(db, config, accountId) {
  const { data: account, error } = await db.from("supporter_accounts")
    .select("id,provider,provider_user_id,access_token_encrypted,refresh_token_encrypted,token_expires_at")
    .eq("id", accountId).eq("provider", "patreon").maybeSingle();
  if (error || !account?.access_token_encrypted || !account.refresh_token_encrypted) throw new Error("Supporter account unavailable");
  let accessToken = decryptToken(account.access_token_encrypted, config.encryptionKey);
  if (Date.parse(account.token_expires_at) <= Date.now() + 60_000) {
    const refreshed = await refreshPatreonToken(config, decryptToken(account.refresh_token_encrypted, config.encryptionKey));
    accessToken = refreshed.access_token;
    const { error: updateError } = await db.from("supporter_accounts").update({
      access_token_encrypted: encryptToken(refreshed.access_token, config.encryptionKey),
      refresh_token_encrypted: encryptToken(refreshed.refresh_token, config.encryptionKey),
      token_expires_at: new Date(Date.now() + Number(refreshed.expires_in) * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    }).eq("id", accountId);
    if (updateError) throw new Error("Token refresh save failed");
  }
  const identity = await fetchPatreonIdentity(config, accessToken);
  if (!safeTokenEqual(account.provider_user_id, identity.providerUserId)) throw new Error("Patreon identity mismatch");
  await storeEntitlement(db, accountId, identity);
  return identity;
}
