import "server-only";
import { cache } from "react";
import { getEarlyAccessConfig } from "../early-access/config";
import { supporterListConfig } from "../early-access/supporter-list-core.mjs";
import { createEarlyAccessDb } from "../early-access/db";
import { editorialReleases, editorialPosts } from "./catalog.mjs";
import { releaseCenter, releaseArticles } from "./model.mjs";

// Read-only adapter to the deployed schema. No SQL changes, public storage, or new project.
// React cache deduplicates within a render; subscription checks remain private/no-store.
export const getReleaseCenter = cache(async () => {
  const listConfig = supporterListConfig(process.env);
  const config = getEarlyAccessConfig() ?? listConfig;
  if (!config) return releaseCenter(editorialReleases, [], "unavailable");
  try {
    const db = createEarlyAccessDb(config);
    const { data, error } = await db
      .from("early_access_releases")
      .select(
        "id,version,platform,storage_bucket,unlock_at,is_published,created_at",
      )
      .eq("is_published", true)
      .eq("storage_bucket", config.bucket)
      .order("created_at", { ascending: false })
      .limit(30)
      .abortSignal(AbortSignal.timeout(5000));
    if (error) throw new Error("Release metadata unavailable");
    // Optional email metadata must not break the existing Patreon release view.
    let releases = data ?? [];
    if (listConfig && !listConfig.testMode && releases.length) {
      try {
        const rules = await db.from('ea_list_release_rules').select('release_id,public_release_at,allowed_tiers')
          .in('release_id', releases.map(r => r.id)).abortSignal(AbortSignal.timeout(5000));
        if (!rules.error) releases = releases.map(r => ({ ...r, list_rules: rules.data?.find(rule => rule.release_id === r.id) ?? null }));
      } catch {
        // Email releases remain unavailable; existing Patreon metadata remains usable.
      }
    }
    return releaseCenter(editorialReleases, releases);
  } catch {
    return releaseCenter(editorialReleases, [], "error");
  }
});
export function getPosts() {
  return [...editorialPosts, ...releaseArticles(editorialReleases)]
    .filter(
      (post) =>
        post.slug && post.date && Number.isFinite(Date.parse(post.date)),
    )
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
}
