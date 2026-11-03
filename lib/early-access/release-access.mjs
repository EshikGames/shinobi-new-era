export function releaseAccessDecision(identity, release, allowedTierIds, bucket, now = Date.now()) {
  if (!identity?.active) return "inactive";
  if (!release?.is_published || release.storage_bucket !== bucket) return "missing";
  const unlockAt = Date.parse(release.unlock_at);
  if (!Number.isFinite(unlockAt)) return "missing";
  if (unlockAt > now) return "locked";
  if (!Array.isArray(identity.tierIds) || !Array.isArray(release.allowed_tier_ids) ||
      !release.allowed_tier_ids.some((tier) => identity.tierIds.includes(tier) && allowedTierIds.includes(tier))) return "tier_denied";
  return "allowed";
}
