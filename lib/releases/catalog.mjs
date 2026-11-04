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
// Concise summaries verified against official itch.io devlogs on 4 November 2026.
// Dates refer to posts, not the upload timestamps of their attached builds.
export const editorialPosts = [
  {
    "slug": "new-character-art-styles",
    "title": "New Character Art Styles | Shinobi New Era",
    "date": "2026-11-02T04:04:23Z",
    "category": "Artwork",
    "source": "https://eshik-games.itch.io/shinobi-new-era/devlog/1746336/new-character-art-styles-shinobi-new-era",
    "summary": "A new art direction for seven familiar characters, bringing more detail, expression and consistency to sprites and CG illustrations.",
    "sections": [
      {
        "heading": "A consistent visual style",
        "paragraphs": [
          "Hinata, Sarada, Himawari, Sakura, Sumire, Boruto and Momoshiki are receiving updated artwork. The aim is to keep each character recognizable while making dialogue sprites and full illustrations feel part of the same world."
        ]
      },
      {
        "heading": "Work in progress",
        "paragraphs": [
          "The designs shown in this devlog are previews. Details may change during development, and Eshik Games invites feedback on the new looks."
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
    "summary": "Spanish, Turkish, Brazilian Portuguese and Arabic join the game, with right-to-left support for Arabic.",
    "sections": [
      {
        "heading": "Beyond the menus",
        "paragraphs": [
          "The localization update covers story dialogue, character events, choices, quests, activities, menus and interface text. Arabic also receives right-to-left presentation."
        ]
      },
      {
        "heading": "Help refine the translations",
        "paragraphs": [
          "Eshik Games reports technical localization checks and asks native speakers to flag awkward wording or text that overflows the interface."
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
    "summary": "The v0.3 update expands the story, character interactions and open-world progression, alongside new artwork and locations.",
    "sections": [
      {
        "heading": "Story and exploration",
        "paragraphs": [
          "The release adds a continuation of the main story, character events and interactions, new locations and backgrounds, and improvements to open-world progression."
        ]
      },
      {
        "heading": "Artwork and polish",
        "paragraphs": [
          "New CGs and animated scenes accompany new and reworked character artwork. Quest and event progression also receive improvements, with fixes and general polish."
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
    "summary": "The original v0.3 release announcement, with a thank-you to everyone who waited and supported development.",
    "sections": [
      {
        "heading": "v0.3 is here",
        "paragraphs": [
          "Eshik Games announces the release of v0.3 and thanks the players who supported the game while the update was in development."
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
    "summary": "With code and artwork complete, v0.3 moves into manual testing and final polish ahead of release.",
    "sections": [
      {
        "heading": "Testing the complete update",
        "paragraphs": [
          "The September report marks the code, artwork, CGs and animations for v0.3 as complete. The remaining work focuses on manually checking events, quests, dialogue and transitions, then fixing issues before release."
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
    "summary": "An early update brings a full English translation, smoother dialogue and readability improvements.",
    "sections": [
      {
        "heading": "English translation and polish",
        "paragraphs": [
          "The announcement reports a complete English translation, corrections to small mistakes and inconsistencies, and improved dialogue flow. Minor polish and stability improvements round out the update."
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
    "summary": "The v0.1 public release introduces a new quest and improvements to existing systems.",
    "sections": [
      {
        "heading": "What changed",
        "paragraphs": [
          "The release adds the Shower quest, improves existing systems, and includes bug fixes and general polish."
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
    "summary": "An interface-focused release improves the quest journal and refines the game’s UI.",
    "sections": [
      {
        "heading": "Interface and quest journal",
        "paragraphs": [
          "v0.2a updates the interface and improves the quest journal system, with further presentation adjustments and general UI polish."
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
    "summary": "v0.2b refines pacing, dialogue and storytelling, with a more polished presentation.",
    "sections": [
      {
        "heading": "Refining the experience",
        "paragraphs": [
          "This update focuses on pacing, clearer dialogue and storytelling, and presentation polish. It also includes a range of fixes and adjustments."
        ]
      }
    ]
  },
  {
    "slug": "v04-development-progress",
    "title": "Shinobi New Era — v0.4 Development Update",
    "date": "2026-10-25T04:55:11Z",
    "category": "Development",
    "summary": "A progress report on v0.4: updated character art, a five-part day cycle, reworked navigation and new music.",
    "source": "https://eshik-games.itch.io/shinobi-new-era/devlog/1728010/shinobi-new-era-v04-development-update",
    "sections": [
      {
        "heading": "Visuals and navigation",
        "paragraphs": [
          "The report covers new sprites and expressions for Sarada, Sumire and Himawari, plus 135 revised story illustrations. Five daily time periods, interactive house doors, floor switching and a redesigned relationship screen expand the interface."
        ]
      },
      {
        "heading": "Sound, gallery and polish",
        "paragraphs": [
          "Six original soundtracks, ambient audio and smoother music transitions accompany gallery improvements. The report also describes save compatibility fixes, navigation fixes and translation checks."
        ]
      },
      {
        "heading": "Development continues",
        "paragraphs": [
          "These notes describe progress toward v0.4, with further story content, events and gameplay features in development. They do not announce a release date."
        ]
      }
    ]
  },
  {
    "slug": "combat-prototype-first-look",
    "title": "Shinobi New Era — First Look at the Combat System",
    "date": "2026-10-21T03:32:14Z",
    "category": "Prototype",
    "summary": "The first gameplay preview of a playable combat prototype, featuring combos, defensive moves and shinobi abilities.",
    "source": "https://eshik-games.itch.io/shinobi-new-era/devlog/1719793/-shinobi-new-era-first-look-at-the-combat-system-",
    "sections": [
      {
        "heading": "The first demonstration",
        "paragraphs": [
          "The prototype showcases combos, blocking, dodging, Substitution Jutsu, Rasengan, Karma abilities and enemy AI. The original devlog includes gameplay footage and invites player feedback."
        ]
      },
      {
        "heading": "An early prototype",
        "paragraphs": [
          "At the time of this announcement, combat was a separate prototype and had not been integrated into the main game. Animations, effects and performance were still being developed."
        ]
      }
    ]
  }
];
