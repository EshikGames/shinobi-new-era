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
    title: "Public Beta — Acts I & II",
    status: "current",
    is_published: true,
    description:
      "Public v0.4 Beta improves the interface, localization and existing game. Current downloads are labelled 0.4beta.fix. Act III is not included.",
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
    changelog_published_at: "2026-10-19T01:48:52Z",
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
    title: "Full v0.4 — Act III in development",
    status: "upcoming",
    description:
      "Act III continues Boruto’s investigation, with new events, quests and locations in development. No release date is confirmed. This is separate from the public Beta.",
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
    "slug": "new-character-art-styles",
    "title": "New Character Art Styles | Shinobi New Era",
    "date": "2026-11-02T04:04:00Z",
    "category": "Artwork",
    "source": "https://eshik-games.itch.io/shinobi-new-era/devlog/1746336/new-character-art-styles-shinobi-new-era",
    "cover": "/images/hero.jpg",
    "summary": "Eshik Games published an update on character art styles. Read the original post for its artwork and details.",
    "sections": [
      {
        "heading": "About this publication",
        "paragraphs": [
          "This dated entry links to the official Eshik Games publication. It is not a promise of current build contents or availability."
        ]
      }
    ]
  },
  {
    "slug": "new-languages-october",
    "title": "New Languages Added to Shinobi New Era",
    "date": "2026-10-06T22:06:53Z",
    "category": "Localization",
    "source": "https://eshik-games.itch.io/shinobi-new-era/devlog/1694604/new-languages-added-to-shinobi-new-era-spanish-turkish-portuguese-arabic",
    "cover": "/images/hero.jpg",
    "summary": "The October localization update added Spanish, Turkish, Brazilian Portuguese and Arabic, including right-to-left presentation for Arabic. The later public Beta expanded the total to 14 languages.",
    "sections": [
      {
        "heading": "About this publication",
        "paragraphs": [
          "This dated entry links to the official Eshik Games publication. It is not a promise of current build contents or availability."
        ]
      }
    ]
  },
  {
    "slug": "v03-major-update",
    "title": "Shinobi New Era v0.3 — Major Update is Out!",
    "date": "2026-10-06T06:21:41Z",
    "category": "Release",
    "source": "https://eshik-games.itch.io/shinobi-new-era/devlog/1693580/shinobi-new-era-v03-major-update-is-out",
    "cover": "/images/hero.jpg",
    "summary": "The public v0.3 announcement covered a story continuation, character events, locations, open-world progression and visual improvements. This is a historical release post, not the current download version.",
    "sections": [
      {
        "heading": "About this publication",
        "paragraphs": [
          "This dated entry links to the official Eshik Games publication. It is not a promise of current build contents or availability."
        ]
      }
    ]
  },
  {
    "slug": "v03-release-announcement",
    "title": "Shinobi New Era v0.3 is out now!",
    "date": "2026-09-30T14:54:28Z",
    "category": "Release",
    "source": "https://eshik-games.itch.io/shinobi-new-era/devlog/1683897/shinobi-new-era-v03-is-out-now",
    "cover": "/images/hero.jpg",
    "summary": "The original v0.3 release announcement, with thanks to players who supported its development. Current public downloads are listed separately in the Release Center.",
    "sections": [
      {
        "heading": "About this publication",
        "paragraphs": [
          "This dated entry links to the official Eshik Games publication. It is not a promise of current build contents or availability."
        ]
      }
    ]
  },
  {
    "slug": "v03-final-development-stage",
    "title": "v0.3 — Final Stage of Development",
    "date": "2026-09-14T15:32:16Z",
    "category": "Development",
    "source": "https://eshik-games.itch.io/shinobi-new-era/devlog/1663899/v03-final-stage-of-development",
    "cover": "/images/hero.jpg",
    "summary": "The September report described v0.3 entering manual testing and content polish. It records that stage of development and does not describe the status of full v0.4.",
    "sections": [
      {
        "heading": "About this publication",
        "paragraphs": [
          "This dated entry links to the official Eshik Games publication. It is not a promise of current build contents or availability."
        ]
      }
    ]
  },
  {
    "slug": "english-translation-update",
    "title": "Shinobi New Era — English translation update",
    "date": "2026-06-25T22:33:54Z",
    "category": "Archive",
    "source": "https://eshik-games.itch.io/shinobi-new-era/devlog/1533777/shinobi-new-era",
    "cover": "/images/hero.jpg",
    "summary": "An early update covered the English translation, dialogue readability, corrections and stability polish.",
    "sections": [
      {
        "heading": "About this publication",
        "paragraphs": [
          "This dated entry links to the official Eshik Games publication. It is not a promise of current build contents or availability."
        ]
      }
    ]
  },
  {
    "slug": "v01-public-release",
    "title": "Shinobi New Era v0.1 (Public Release)",
    "date": "2026-06-25T22:33:40Z",
    "category": "Archive",
    "source": "https://eshik-games.itch.io/shinobi-new-era/devlog/1545028/shinobi-new-era-v01-public-release",
    "cover": "/images/hero.jpg",
    "summary": "An early public release post covered a new quest, improvements to existing systems and fixes. Follow the original post for the historical announcement.",
    "sections": [
      {
        "heading": "About this publication",
        "paragraphs": [
          "This dated entry links to the official Eshik Games publication. It is not a promise of current build contents or availability."
        ]
      }
    ]
  },
  {
    "slug": "v02a-public-release",
    "title": "Shinobi New Era v0.2a public release",
    "date": "2026-06-25T22:33:29Z",
    "category": "Archive",
    "source": "https://eshik-games.itch.io/shinobi-new-era/devlog/1551963/shinobi-new-era-v02a-public-release",
    "cover": "/images/hero.jpg",
    "summary": "The v0.2a announcement focused on the interface and quest journal, with additional presentation adjustments.",
    "sections": [
      {
        "heading": "About this publication",
        "paragraphs": [
          "This dated entry links to the official Eshik Games publication. It is not a promise of current build contents or availability."
        ]
      }
    ]
  },
  {
    "slug": "v02b-public-release",
    "title": "Shinobi New Era v0.2b public release",
    "date": "2026-06-25T22:32:56Z",
    "category": "Archive",
    "source": "https://eshik-games.itch.io/shinobi-new-era/devlog/1564383/shinobi-new-era-v02b-public-release",
    "cover": "/images/hero.jpg",
    "summary": "The v0.2b post described revisions to pacing, dialogue, storytelling and presentation, alongside fixes.",
    "sections": [
      {
        "heading": "About this publication",
        "paragraphs": [
          "This dated entry links to the official Eshik Games publication. It is not a promise of current build contents or availability."
        ]
      }
    ]
  }
,
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
          "In the 21 October announcement, the developer described the prototype as separate from the main game. Current integration has not been verified here; this historical preview does not establish what is in the public Beta.",
        ],
      },
    ],
  },
];
