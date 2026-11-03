import { getEarlyAccessConfig, stateCookieName } from "@/lib/early-access/config";
import { createEarlyAccessDb, audit } from "@/lib/early-access/db";
import { exchangePatreonCode, fetchPatreonIdentity } from "@/lib/early-access/patreon.mjs";
import { safeTokenEqual, tokenHash } from "@/lib/early-access/security.mjs";
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
  if (suppliedState?.length !== 43 || cookieState?.length !== 43 || !safeTokenEqual(suppliedState, cookieState) || !code || code.length > 2048) {
    return privateJson({ error: "invalid_callback" }, 400);
  }
  try {
    const db = createEarlyAccessDb(config);
    if (!(await consumeOAuthState(db, tokenHash(suppliedState)))) return privateJson({ error: "expired_or_reused_state" }, 400);
    const tokens = await exchangePatreonCode(config, code);
    const identity = await fetchPatreonIdentity(config, tokens.access_token);
    const accountId = await storePatreonAccount(db, config, identity, tokens);
    const sessionToken = await createSupporterSession(db, accountId);
    await audit(db, "oauth_callback", "success", accountId);
    const response = safeRedirect(`${config.siteOrigin}/early-access#supporters`);
    response.cookies.set(stateCookieName(config), "", {
      httpOnly: true, secure: config.secureCookie, sameSite: "lax", path: "/", maxAge: 0,
    });
    setSupporterCookie(response, config, sessionToken);
    return response;
  } catch {
    return privateJson({ error: "verification_failed" }, 503);
  }
}
