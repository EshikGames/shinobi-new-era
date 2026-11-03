import { getEarlyAccessConfig } from "@/lib/early-access/config";
import { createEarlyAccessDb, consumeRateLimit } from "@/lib/early-access/db";
import { readSupporterSession } from "@/lib/early-access/session";
import { verifyLivePatreonEntitlement } from "@/lib/early-access/entitlement";
import { pseudonymousKey } from "@/lib/early-access/security.mjs";
import { privateJson } from "@/lib/early-access/response";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  const config = getEarlyAccessConfig();
  if (!config) return privateJson({ status: "unavailable", loginEnabled: false });
  try {
    const db = createEarlyAccessDb(config);
    const session = await readSupporterSession(request, db, config);
    if (!session) return privateJson({ status: "unauthorized", loginEnabled: true }, 401);
    const keyHash = pseudonymousKey(`status:${session.account_id}`, config.encryptionKey);
    if (!(await consumeRateLimit(db, keyHash, 30, 60))) return privateJson({ status: "error", loginEnabled: true }, 429);
    const identity = await verifyLivePatreonEntitlement(db, config, session.account_id);
    return privateJson({ status: identity.active ? "active" : "expired", loginEnabled: true, provider: "patreon" });
  } catch {
    return privateJson({ status: "error", loginEnabled: true }, 503);
  }
}
