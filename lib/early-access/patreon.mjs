const AUTHORIZE_URL = "https://www.patreon.com/oauth2/authorize";
const TOKEN_URL = "https://www.patreon.com/api/oauth2/token";
const IDENTITY_URL = "https://www.patreon.com/api/oauth2/v2/identity";

export function patreonAuthorizationUrl(config, state) {
  const url = new URL(AUTHORIZE_URL);
  url.search = new URLSearchParams({
    response_type: "code",
    client_id: config.patreonClientId,
    redirect_uri: config.callbackUrl,
    scope: "identity identity.memberships",
    state,
  }).toString();
  return url.toString();
}

async function tokenRequest(config, fields, fetcher = fetch) {
  const response = await fetcher(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ ...fields, client_id: config.patreonClientId, client_secret: config.patreonClientSecret }),
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error("Patreon token request failed");
  const token = await response.json();
  if (typeof token.access_token !== "string" || !token.access_token ||
      typeof token.refresh_token !== "string" || !token.refresh_token ||
      !Number.isSafeInteger(Number(token.expires_in)) || Number(token.expires_in) <= 0) {
    throw new Error("Invalid Patreon token response");
  }
  return token;
}

export function exchangePatreonCode(config, code, fetcher) {
  return tokenRequest(config, { grant_type: "authorization_code", code, redirect_uri: config.callbackUrl }, fetcher);
}

export function refreshPatreonToken(config, refreshToken, fetcher) {
  return tokenRequest(config, { grant_type: "refresh_token", refresh_token: refreshToken }, fetcher);
}

export function evaluatePatreonIdentity(payload, campaignId, allowedTierIds) {
  const providerUserId = payload?.data?.type === "user" && typeof payload.data.id === "string" ? payload.data.id : null;
  if (!providerUserId) throw new Error("Invalid Patreon identity");
  const members = Array.isArray(payload.included) ? payload.included.filter((item) => item.type === "member") : [];
  const membership = members.find((item) => item.relationships?.campaign?.data?.id === campaignId);
  const status = membership?.attributes?.patron_status ?? "unknown";
  const tierIds = (membership?.relationships?.currently_entitled_tiers?.data ?? [])
    .filter((item) => item.type === "tier" && typeof item.id === "string")
    .map((item) => item.id);
  const active = status === "active_patron" && tierIds.some((id) => allowedTierIds.includes(id));
  return { providerUserId, campaignId, patronStatus: status, tierIds, active };
}

export async function fetchPatreonIdentity(config, accessToken, fetcher = fetch) {
  const url = new URL(IDENTITY_URL);
  url.searchParams.set("include", "memberships.campaign,memberships.currently_entitled_tiers");
  url.searchParams.set("fields[member]", "patron_status");
  const response = await fetcher(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error("Patreon identity request failed");
  return evaluatePatreonIdentity(await response.json(), config.campaignId, config.allowedTierIds);
}
