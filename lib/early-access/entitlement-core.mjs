import { decryptToken, encryptToken, safeTokenEqual } from "./security.mjs";

export async function verifyStoredPatreonAccount(account, config, { refreshToken, fetchIdentity, saveTokens }, now = Date.now()) {
  if (account?.provider !== "patreon" || !account.provider_user_id ||
      !account.access_token_encrypted || !account.refresh_token_encrypted) {
    throw new Error("Supporter account unavailable");
  }
  let accessToken = decryptToken(account.access_token_encrypted, config.encryptionKey);
  const expiresAt = Date.parse(account.token_expires_at);
  if (!Number.isFinite(expiresAt) || expiresAt <= now + 60_000) {
    const refreshed = await refreshToken(decryptToken(account.refresh_token_encrypted, config.encryptionKey));
    accessToken = refreshed.access_token;
    await saveTokens({
      access_token_encrypted: encryptToken(refreshed.access_token, config.encryptionKey),
      refresh_token_encrypted: encryptToken(refreshed.refresh_token, config.encryptionKey),
      token_expires_at: new Date(now + Number(refreshed.expires_in) * 1000).toISOString(),
      updated_at: new Date(now).toISOString(),
    });
  }
  const identity = await fetchIdentity(accessToken);
  if (!safeTokenEqual(account.provider_user_id, identity.providerUserId)) throw new Error("Patreon identity mismatch");
  return identity;
}
