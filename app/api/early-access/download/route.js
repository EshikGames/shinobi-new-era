import { getEarlyAccessConfig } from "@/lib/early-access/config";
import { createEarlyAccessDb, consumeRateLimit, audit } from "@/lib/early-access/db";
import { readSupporterSession } from "@/lib/early-access/session";
import { verifyLivePatreonEntitlement } from "@/lib/early-access/entitlement";
import { pseudonymousKey } from "@/lib/early-access/security.mjs";
import { releaseAccessDecision } from "@/lib/early-access/release-access.mjs";
import { privateJson, sameOrigin } from "@/lib/early-access/response";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  const config = getEarlyAccessConfig();
  if (!config) return privateJson({ status: "unavailable" }, 503);
  if (!sameOrigin(request, config.siteOrigin) || !request.headers.get("content-type")?.startsWith("application/json")) {
    return privateJson({ error: "invalid_request" }, 403);
  }
  try {
    const body = await request.json();
    if (typeof body?.releaseId !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(body.releaseId)) return privateJson({ error: "invalid_release" }, 400);
    const db = createEarlyAccessDb(config);
    const session = await readSupporterSession(request, db, config);
    if (!session) return privateJson({ error: "unauthorized" }, 401);
    const keyHash = pseudonymousKey(`download:${session.account_id}`, config.encryptionKey);
    if (!(await consumeRateLimit(db, keyHash, 10, 60))) return privateJson({ error: "rate_limited" }, 429);
    const identity = await verifyLivePatreonEntitlement(db, config, session.account_id);
    if (!identity.active) {
      await audit(db, "download", "inactive", session.account_id);
      return privateJson({ error: "access_denied" }, 403);
    }
    const { data: release, error } = await db.from("early_access_releases")
      .select("id,storage_bucket,object_path,unlock_at,allowed_tier_ids,is_published")
      .eq("id", body.releaseId).eq("is_published", true).maybeSingle();
    if (error) throw new Error("Release lookup failed");
    const decision = releaseAccessDecision(identity, release, config.allowedTierIds, config.bucket);
    if (decision === "missing") return privateJson({ error: "release_not_found" }, 404);
    if (decision === "locked") {
      await audit(db, "download", "release_locked", session.account_id);
      return privateJson({ error: "release_locked" }, 423);
    }
    if (decision === "tier_denied") {
      await audit(db, "download", "tier_denied", session.account_id);
      return privateJson({ error: "access_denied" }, 403);
    }
    const { data: signed, error: signError } = await db.storage.from(config.bucket).createSignedUrl(release.object_path, 60, { download: true });
    if (signError || !signed?.signedUrl) throw new Error("Signing failed");
    const { error: grantError } = await db.from("download_grants").insert({
      account_id: session.account_id, release_id: release.id,
      expires_at: new Date(Date.now() + 60_000).toISOString(),
    });
    if (grantError) throw new Error("Grant audit failed");
    await audit(db, "download", "granted", session.account_id);
    return privateJson({ url: signed.signedUrl, expiresIn: 60 });
  } catch {
    return privateJson({ error: "verification_unavailable" }, 503);
  }
}
