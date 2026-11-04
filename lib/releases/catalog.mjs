// Owner confirmed 0.4beta / next 0.4 on 4 November 2026.
// Existing v0.2b URLs are retained as archives, not relabelled as 0.4beta.
const legacyDownloads = [
  {
    platform: "Windows",
    url: "https://mega.nz/file/96InnALA#803Y8r-9-hRqJNQrjtm8pJUX2bMssH6-dimb_mf-Po8",
    size: "406 MB",
  },
  {
    platform: "macOS",
    url: "https://mega.nz/file/EiJDQaCA#BP3fqQZR770PRVuMK3XaCXSYkQBKmzRtd9CvE2azYDw",
    size: "401 MB",
  },
  {
    platform: "Android",
    url: "https://mega.nz/file/N3pz3aCK#_nnzLYTwyYB05zRrfbYA7EXH4PrGwmTYqoI5FrNSKRc",
    size: "416 MB",
  },
];
function release(fields) {
  return {
    version: null,
    title: null,
    description: "",
    release_type: "public",
    status: "announced",
    public_release_at: null,
    early_access_at: null,
    changelog: {},
    platforms: [],
    public_download_urls: [],
    private_storage_paths: [],
    allowed_tier_ids: [],
    is_published: false,
    created_at: null,
    updated_at: null,
    ...fields,
  };
}
export const editorialReleases = [
  release({
    version: "0.4beta",
    title: "The current chapter",
    status: "current",
    is_published: true,
    description:
      "The current public version confirmed by Eshik Games. Download links for this version are awaiting confirmation.",
    platforms: ["Windows", "Android"],
  }),
  release({
    version: "0.4",
    title: "What comes next",
    status: "upcoming",
    description:
      "The next version announced by Eshik Games. Release timing and details will be shared when confirmed.",
  }),
  release({
    version: "0.2b",
    title: "Previously linked public build",
    status: "archived",
    is_published: true,
    description:
      "The original download links retained from the existing website. These are not links to 0.4beta.",
    platforms: legacyDownloads.map((item) => item.platform),
    public_download_urls: legacyDownloads,
  }),
];
// Add only owner-approved, dated publications. Empty is a supported state.
export const editorialPosts = [];
