// Owner confirmed 0.4beta / next 0.4 on 4 November 2026.
// Existing v0.2b URLs are retained as archives, not relabelled as 0.4beta.
import { gameSources } from "../game-info.mjs";
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
      "The public beta brings expanded localization and a refreshed interface. The official itch.io downloads are currently labelled 0.4beta.fix.",
    public_release_at: "2026-10-18T20:51:00Z",
    platforms: ["Windows", "macOS", "Linux", "Android"],
    public_download_urls: ["Windows", "macOS", "Linux", "Android"].map(
      (platform) => ({
        platform,
        url: gameSources.game,
        size: "1.3 GB · 0.4beta.fix",
      }),
    ),
    changelog_source: gameSources.beta,
    changelog: {
      UI: [
        "Updated UI system: reworked menus, screens and interface elements with more consistent presentation and improved usability.",
      ],
      "Bug Fixes": [
        "General usability fixes and polish; the announcement does not list individual fixes.",
      ],
      "Other Improvements": [
        "Localization expanded to 14 languages, including interface, settings and quest text. Translation refinement continues.",
      ],
    },
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
// Concise, attributed summaries of real developer posts. Original publication dates.
export const editorialPosts = [
  {
    slug: "v04-development-progress",
    title: "Inside the next update",
    date: "2026-10-25T04:55:00Z",
    category: "Development",
    cover: "/images/hero.jpg",
    summary:
      "A progress report on v0.4: navigation, character presentation, audio and technical polish.",
    source: gameSources.development,
    sections: [
      {
        heading: "A world with more rhythm",
        paragraphs: [
          "The report describes a five-part day cycle, interactive house doors and floor navigation, plus a revised relationship screen.",
        ],
      },
      {
        heading: "Presentation and polish",
        paragraphs: [
          "Character visuals, location music and ambient effects received attention. The team also reports fixes to navigation and saves, alongside translation checks.",
        ],
      },
      {
        heading: "Still in development",
        paragraphs: [
          "These are progress notes for v0.4. They do not announce a release date or guarantee that every feature is present in the public beta.",
        ],
      },
    ],
  },
  {
    slug: "combat-prototype-first-look",
    title: "A first look at combat",
    date: "2026-10-21T03:32:00Z",
    category: "Prototype",
    cover: "/images/hero.jpg",
    summary:
      "An early combat experiment explores movement, defensive actions and shinobi abilities.",
    source: gameSources.combat,
    sections: [
      {
        heading: "What the prototype explores",
        paragraphs: [
          "The demonstration includes combo attacks, blocks, evasive moves, Substitution Jutsu, Rasengan and Karma abilities, with opponents controlled by AI.",
        ],
      },
      {
        heading: "A separate experiment",
        paragraphs: [
          "The developer states that this prototype is not yet integrated into the main game. Animation, effects and performance remain areas of work.",
        ],
      },
    ],
  },
];
