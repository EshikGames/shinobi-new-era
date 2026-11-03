import { getEarlyAccessConfig } from "@/lib/early-access/config";
import { createEarlyAccessDb, consumeRateLimit, audit } from "@/lib/early-access/db";
import { readSupporterSession } from "@/lib/early-access/session";
import { verifyLivePatreonEntitlement } from "@/lib/early-access/entitlement";
import { pseudonymousKey } from "@/lib/early-access/security.mjs";
import { issueProtectedDownload, DownloadFlowError } from "@/lib/early-access/download-flow.mjs";
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
    const result = await issueProtectedDownload({
      session, releaseId: body.releaseId, campaignId: config.campaignId,
      allowedTierIds: config.allowedTierIds, bucket: config.bucket,
      verifyIdentity: (accountId) => verifyLivePatreonEntitlement(db, config, accountId),
      loadRelease: async (releaseId) => {
        const { data, error } = await db.from("early_access_releases")
          .select("id,storage_bucket,object_path,unlock_at,allowed_tier_ids,is_published")
          .eq("id", releaseId).eq("is_published", true).maybeSingle();
        if (error) throw new Error("Release lookup failed");
        return data;
      },
      signUrl: async (bucket, path, expiresIn) => {
        const { data, error } = await db.storage.from(bucket).createSignedUrl(path, expiresIn, { download: true });
        if (error) throw new Error("Signing failed");
        return data?.signedUrl;
      },
      saveGrant: async (accountId, releaseId, expiresIn) => {
        const { error } = await db.from("download_grants").insert({
          account_id: accountId, release_id: releaseId,
          expires_at: new Date(Date.now() + expiresIn * 1000).toISOString(),
        });
        if (error) throw new Error("Grant audit failed");
      },
      audit: (outcome, accountId) => audit(db, "download", outcome, accountId),
    });
    return privateJson(result);
  } catch (error) {
    if (error instanceof DownloadFlowError) return privateJson({ error: error.code }, error.status);
    return privateJson({ error: "verification_unavailable" }, 503);
  }
}
