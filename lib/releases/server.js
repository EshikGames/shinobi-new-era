import "server-only";
import { cache } from "react";
import { getEarlyAccessConfig } from "../early-access/config";
import { createEarlyAccessDb } from "../early-access/db";
import { editorialReleases, editorialPosts } from "./catalog.mjs";
import { releaseCenter, releaseArticles } from "./model.mjs";

// Read-only adapter to the deployed schema. No SQL changes, public storage, or new project.
// React cache deduplicates within a render; subscription checks remain private/no-store.
export const getReleaseCenter = cache(async () => {
  const config = getEarlyAccessConfig();
  if (!config) return releaseCenter(editorialReleases, [], "unavailable");
  try {
    const { data, error } = await createEarlyAccessDb(config)
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
    return releaseCenter(editorialReleases, data ?? []);
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
