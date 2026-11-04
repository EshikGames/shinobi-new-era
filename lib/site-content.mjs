// Editorial source. Unknown dates, features and links must remain unset.
export const community = [
  {
    name: "Discord",
    icon: "discord",
    href: "https://discord.gg/HpGgzDgycE",
    detail: "Talk with the community",
  },
  {
    name: "Patreon",
    icon: "patreon",
    href: "https://www.patreon.com/cw/eshikgames",
    detail: "Support the next chapter",
  },
  {
    name: "Boosty",
    icon: "boosty",
    href: "https://boosty.to/eshikgames",
    detail: "Follow creator updates",
  },
  {
    name: "SubscribeStar",
    icon: "subscribestar",
    href: "https://subscribestar.adult/eshik-games",
    detail: "Visit our creator page",
  },
  {
    name: "Itch.io",
    icon: "itchio",
    href: "https://eshik-games.itch.io/shinobi-new-era",
    detail: "Find the game on Itch.io",
  },
];
export const characters = [
  "Boruto",
  "Momoshiki",
  "Hinata",
  "Himawari",
  "Sakura",
  "Sumire",
  "Sarada",
].map((name) => ({
  name,
  image: `/images/characters/${name.toLowerCase()}.jpg`,
}));
export const features = [
  {
    number: "01",
    icon: "compass",
    title: "A world to explore",
    text: "Discover locations and follow the open-world progression expanded in v0.3.",
    tag: "SANDBOX EXPLORATION",
  },
  {
    number: "02",
    icon: "people",
    title: "People to connect with",
    text: "Character events and new encounters carry the main story forward.",
    tag: "CHARACTER STORIES",
  },
  {
    number: "03",
    icon: "language",
    title: "A story in your language",
    text: "The public beta expands localization across dialogue, quests, menus and settings.",
    tag: "LOCALIZED EXPERIENCE",
  },
  {
    number: "04",
    icon: "interface",
    title: "A renewed UI system",
    text: "Reworked menus, screens and interface elements bring a more consistent look and smoother navigation to the public beta.",
    tag: "UPDATED INTERFACE",
  },
];
export const faqs = [
  {
    question: "What is Shinobi New Era?",
    answer:
      "An 18+ single-player visual novel by Eshik Games, built with Ren’Py. Its story combines character encounters, quests and exploration in a world inspired by Naruto and Boruto.",
  },
  {
    question: "Where can I download the game?",
    answer:
      "Find the current public beta on the official itch.io page through our Release Center. The older v0.2b MEGA links remain in the archive with their original labels.",
  },
  {
    question: "Can I play in my browser?",
    answer:
      "Yes. Open Play Online to launch the existing browser edition. Loading time depends on your device and connection; the downloadable edition is an alternative.",
  },
  {
    question: "How does Early Access work?",
    answer:
      "Sign in with Patreon to verify your subscription. Access requires an active subscription in an eligible tier, a published build and its unlock date. Signing in does not guarantee that a build is available.",
  },
  {
    question: "When is the next release?",
    answer:
      "Version 0.4 is the next announced version. A release date has not been announced here. Confirmed dates and release notes will appear in the Release Center.",
  },
  {
    question: "Is the new combat system in the game?",
    answer:
      "The 21 October 2026 preview shows a separate prototype with combos, defensive moves and shinobi abilities. That announcement explicitly says it is not integrated into the main game yet.",
  },
  {
    question: "Which platforms are supported?",
    answer:
      "The official itch.io page lists Windows, macOS, Linux and Android. Choose the matching PC archive, Mac archive or Android APK there. The website also hosts a separate browser edition.",
  },
  {
    question: "Are the translations final?",
    answer:
      "The public-beta announcement lists 14 languages. Translations are still being refined; report the language, game version and affected text when you find an issue.",
  },
  {
    question: "Where can I get help?",
    answer:
      "Visit the official Discord through the Community links. Include your version, platform and the error message when reporting a problem. Keep account tokens and private information out of reports.",
  },
];
// Only existing, already-public website artwork. No game CG directories are scanned.
export const gallery = [
  {
    src: "/images/hero.jpg",
    alt: "Konoha beneath a crescent moon",
    category: "World",
    title: "Konoha after dark",
  },
  {
    src: "/images/1.jpg",
    alt: "Shinobi New Era official promotional artwork",
    category: "Artwork",
    title: "Begin your legacy",
  },
];
export const guide = [
  {
    title: "Install & launch",
    icon: "download",
    text: "Choose the download labelled for your platform. Extract a desktop archive before launching it. For Android, use the APK from the official download link and follow your device’s installation instructions.",
  },
  {
    title: "Controls",
    icon: "play",
    text: "Use the game’s on-screen controls and menus. Keyboard shortcuts and touch controls can differ between editions; check the help available in your installed build.",
  },
  {
    title: "Your saves",
    icon: "save",
    text: "Back up your saves before updating. Browser and downloaded editions can store progress differently. Do not clear browser site data if it contains progress you want to keep.",
  },
  {
    title: "Quests & exploration",
    icon: "quest",
    text: "Follow the objectives and dialogue in your current build. Exact quest requirements depend on the version; a verified walkthrough has not been published on this site yet.",
  },
  {
    title: "Time & mechanics",
    icon: "moon",
    text: "The 25 October v0.4 progress report describes five periods: Morning, Day, Evening, Night and Midnight. Follow the clock and available actions in your build; the report is a development update, not a walkthrough for every edition.",
  },
  {
    title: "Need a hand?",
    icon: "chat",
    text: "For installation or loading issues, share the game version, platform and error message with the official Discord. Do not bypass security warnings for files from unofficial sources.",
  },
];
