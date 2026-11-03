import { getEarlyAccessConfig, stateCookieName } from "@/lib/early-access/config";
import { createEarlyAccessDb, audit } from "@/lib/early-access/db";
import { exchangePatreonCode, fetchPatreonIdentity } from "@/lib/early-access/patreon.mjs";
import { completePatreonOAuth, oauthCallbackRecoveryUrl } from "@/lib/early-access/oauth-flow.mjs";
import { consumeOAuthState } from "@/lib/early-access/oauth-state.mjs";
import { storePatreonAccount } from "@/lib/early-access/entitlement";
import { createSupporterSession, setSupporterCookie } from "@/lib/early-access/session";
import { privateJson, safeRedirect } from "@/lib/early-access/response";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  const config = getEarlyAccessConfig();
  if (!config) return privateJson({ status: "unavailable" }, 503);
  if (new URL(request.url).origin !== config.siteOrigin) return privateJson({ error: "invalid_origin" }, 400);
  const suppliedState = new URL(request.url).searchParams.get("state");
  const cookieState = request.cookies.get(stateCookieName(config))?.value;
  const code = new URL(request.url).searchParams.get("code");
  try {
    const db = createEarlyAccessDb(config);
    const { sessionToken } = await completePatreonOAuth({
      suppliedState, cookieState, code,
      consumeState: (hash) => consumeOAuthState(db, hash),
      exchangeCode: (value) => exchangePatreonCode(config, value),
      fetchIdentity: (token) => fetchPatreonIdentity(config, token),
      storeAccount: (identity, tokens) => storePatreonAccount(db, config, identity, tokens),
      createSession: (accountId) => createSupporterSession(db, accountId),
      auditSuccess: (accountId) => audit(db, "oauth_callback", "success", accountId),
    });
    const response = safeRedirect(`${config.siteOrigin}/early-access#supporters`);
    response.cookies.set(stateCookieName(config), "", {
      httpOnly: true, secure: config.secureCookie, sameSite: "lax", path: "/", maxAge: 0,
    });
    setSupporterCookie(response, config, sessionToken);
    return response;
  } catch (error) {
    const recoveryUrl = oauthCallbackRecoveryUrl(error, config.siteOrigin);
    if (recoveryUrl) {
      // Preserve existing session and any newer login attempt's state cookie.
      // Never log the request URL, authorization code, state or cookie values.
      console.info("Patreon callback rejected; returning to access verification", { reason: error.code });
      return safeRedirect(recoveryUrl);
    }
    return privateJson({ error: "verification_failed" }, 503);
  }
}
