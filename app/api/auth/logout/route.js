import { getEarlyAccessConfig, sessionCookieName, stateCookieName } from "@/lib/early-access/config";
import { createEarlyAccessDb, audit } from "@/lib/early-access/db";
import { clearSupporterCookie, revokeSupporterSession } from "@/lib/early-access/session";
import { privateJson, sameOrigin } from "@/lib/early-access/response";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  const config = getEarlyAccessConfig();
  if (!config) return privateJson({ status: "unavailable" }, 503);
  if (!sameOrigin(request, config.siteOrigin)) return privateJson({ error: "invalid_origin" }, 403);
  try {
    const db = createEarlyAccessDb(config);
    const token = request.cookies.get(sessionCookieName(config))?.value;
    await revokeSupporterSession(db, token);
    await audit(db, "logout", "success");
    const response = privateJson({ status: "signed_out" });
    clearSupporterCookie(response, config);
    response.cookies.set(stateCookieName(config), "", {
      httpOnly: true, secure: config.secureCookie, sameSite: "lax", path: "/", maxAge: 0,
    });
    return response;
  } catch {
    return privateJson({ error: "service_unavailable" }, 503);
  }
}
