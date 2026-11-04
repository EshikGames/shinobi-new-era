export const changelogSections = [
  "Story",
  "Characters",
  "Gameplay",
  "UI",
  "Bug Fixes",
  "Other Improvements",
];
export function safePublicUrl(value) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}
// Explicit allowlist: never serialize private paths, buckets, tokens or tier rules.
export function publicReleaseView(release) {
  return {
    id: typeof release.id === "string" ? release.id : null,
    version: release.version,
    title: release.title,
    description: release.description,
    release_type: release.release_type,
    status: release.status,
    public_release_at: release.public_release_at ?? null,
    early_access_at: release.early_access_at ?? null,
    changelog: release.changelog ?? {},
    platforms: release.platforms ?? [],
    public_download_urls:
      release.release_type === "public" && release.is_published
        ? (release.public_download_urls ?? [])
            .filter((item) => safePublicUrl(item.url))
            .map(({ platform, url, size }) => ({ platform, url, size }))
        : [],
    is_published: release.is_published === true,
    created_at: release.created_at ?? null,
    updated_at: release.updated_at ?? null,
  };
}
export function privateReleaseViews(rows) {
  return rows
    .filter(
      (row) =>
        row.is_published &&
        row.storage_bucket === "early-access-builds" &&
        typeof row.id === "string" &&
        typeof row.version === "string" &&
        [
          "Windows",
          "Android",
          "macOS",
          "windows",
          "android",
          "macos",
          "pc",
          "apk",
        ].includes(row.platform) &&
        Number.isFinite(Date.parse(row.unlock_at)),
    )
    .map((row) =>
      publicReleaseView({
        id: row.id,
        version: row.version,
        title: `${row.version} supporter build`,
        description:
          "A protected build. Your subscription, tier and unlock date are checked before every download.",
        release_type: "early_access",
        status: "published",
        early_access_at: row.unlock_at,
        platforms: [
          {
            pc: "Windows",
            apk: "Android",
            windows: "Windows",
            android: "Android",
            macos: "macOS",
          }[row.platform] ?? row.platform,
        ],
        changelog: {},
        is_published: true,
        created_at: row.created_at,
        updated_at: null,
      }),
    );
}
export function releaseCenter(
  editorial,
  privateRows = [],
  availability = "ready",
) {
  const publicReleases = editorial.map(publicReleaseView);
  return {
    current:
      publicReleases.find(
        (item) => item.status === "current" && item.is_published,
      ) ?? null,
    next: publicReleases.find((item) => item.status === "upcoming") ?? null,
    previous: publicReleases.filter(
      (item) => item.status === "archived" && item.is_published,
    ),
    early: privateReleaseViews(privateRows).sort(
      (a, b) =>
        Date.parse(b.created_at ?? b.early_access_at) -
        Date.parse(a.created_at ?? a.early_access_at),
    ),
    availability,
  };
}
export function releaseArticles(releases) {
  return releases
    .filter(
      (r) =>
        r.is_published &&
        r.release_type === "public" &&
        r.public_release_at &&
        Number.isFinite(Date.parse(r.public_release_at)) &&
        Object.values(r.changelog ?? {}).some((items) => items.length),
    )
    .map((r) => ({
      slug: `release-${r.version.replace(/[^a-z0-9.-]/gi, "-").toLowerCase()}`,
      title: `Shinobi New Era ${r.version} — release notes`,
      date: r.public_release_at,
      category: "Changelog",
      source: r.changelog_source,
      cover: "/images/hero.jpg",
      summary: r.description,
      sections: Object.entries(r.changelog)
        .filter(([, items]) => items.length)
        .map(([heading, paragraphs]) => ({ heading, paragraphs })),
    }));
}
