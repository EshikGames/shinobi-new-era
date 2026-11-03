import { releaseAccessDecision } from "./release-access.mjs";

export class DownloadFlowError extends Error {
  constructor(code, status) {
    super(code);
    this.code = code;
    this.status = status;
  }
}

export async function issueProtectedDownload({ session, releaseId, campaignId, allowedTierIds, bucket, verifyIdentity, loadRelease, signUrl, saveGrant, audit }) {
  if (!session?.account_id) throw new DownloadFlowError("unauthorized", 401);
  const identity = await verifyIdentity(session.account_id);
  if (!identity.active || identity.campaignId !== campaignId || identity.patronStatus !== "active_patron") {
    await audit("inactive", session.account_id);
    throw new DownloadFlowError("access_denied", 403);
  }
  const release = await loadRelease(releaseId);
  const decision = releaseAccessDecision(identity, release, allowedTierIds, bucket);
  if (decision === "missing") throw new DownloadFlowError("release_not_found", 404);
  if (decision === "locked") {
    await audit("release_locked", session.account_id);
    throw new DownloadFlowError("release_locked", 423);
  }
  if (decision === "tier_denied") {
    await audit("tier_denied", session.account_id);
    throw new DownloadFlowError("access_denied", 403);
  }
  if (decision !== "allowed") throw new DownloadFlowError("access_denied", 403);
  const expiresIn = 60;
  const url = await signUrl(bucket, release.object_path, expiresIn);
  if (!url) throw new Error("Signing failed");
  await saveGrant(session.account_id, release.id, expiresIn);
  await audit("granted", session.account_id);
  return { url, expiresIn };
}
