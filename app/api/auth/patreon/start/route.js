import { getEarlyAccessConfig, stateCookieName } from "@/lib/early-access/config";
import { createEarlyAccessDb, consumeRateLimit } from "@/lib/early-access/db";
import { patreonAuthorizationUrl } from "@/lib/early-access/patreon.mjs";
import { pseudonymousKey } from "@/lib/early-access/security.mjs";
import { createOAuthState, OAUTH_STATE_TTL_SECONDS } from "@/lib/early-access/oauth-state.mjs";
import { privateJson, safeRedirect } from "@/lib/early-access/response";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  const config = getEarlyAccessConfig();
  if (!config) return privateJson({ status: "unavailable" }, 503);
  if (new URL(request.url).origin !== config.siteOrigin) return privateJson({ error: "invalid_origin" }, 400);
  try {
    const db = createEarlyAccessDb(config);
    const ip = request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    const rateKey = pseudonymousKey(`oauth-start:${ip}`, config.encryptionKey);
    if (!(await consumeRateLimit(db, rateKey, 12, 60))) return privateJson({ error: "rate_limited" }, 429);
    const { state, record } = createOAuthState();
    const { error } = await db.from("supporter_oauth_states").insert(record);
    if (error) throw new Error("OAuth state save failed");
    const response = safeRedirect(patreonAuthorizationUrl(config, state));
    response.cookies.set(stateCookieName(config), state, {
      httpOnly: true, secure: config.secureCookie, sameSite: "lax", path: "/", maxAge: OAUTH_STATE_TTL_SECONDS,
    });
    return response;
  } catch {
    return privateJson({ error: "service_unavailable" }, 503);
  }
}
