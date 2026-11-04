// Editorial source. Unknown dates, features and links must remain unset.
export const community = [
  {
    name: "Discord",
    href: "https://discord.gg/HpGgzDgycE",
    detail: "Talk with the community",
  },
  {
    name: "Patreon",
    href: "https://www.patreon.com/cw/eshikgames",
    detail: "Support the next chapter",
  },
  {
    name: "Boosty",
    href: "https://boosty.to/eshikgames",
    detail: "Follow creator updates",
  },
  {
    name: "SubscribeStar",
    href: "https://subscribestar.adult/eshik-games",
    detail: "Visit our creator page",
  },
  {
    name: "Itch.io",
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
    title: "A world to explore",
    text: "Step into Konoha and discover its places, people and stories.",
    tag: "SANDBOX EXPLORATION",
  },
  {
    number: "02",
    title: "People to connect with",
    text: "Meet familiar characters and follow the relationships at the heart of the story.",
    tag: "CHARACTER STORIES",
  },
  {
    number: "03",
    title: "Your path forward",
    text: "Make choices, take on quests and find your own rhythm in a visual novel world.",
    tag: "STORY & GAMEPLAY",
  },
];
export const faqs = [
  {
    question: "What is Shinobi New Era?",
    answer:
      "An independent sandbox visual novel inspired by the Naruto and Boruto universe, developed by Eshik Games. Explore, complete quests and follow character stories.",
  },
  {
    question: "Where can I download the game?",
    answer:
      "The Release Center brings together the current release information and existing public download links. Each link is labelled with the version it belongs to.",
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
    text: "Choose the download labelled for your platform. Extract a desktop archive before launching it. For Android, use the APK from the official download link and follow your device’s installation instructions.",
  },
  {
    title: "Controls",
    text: "Use the game’s on-screen controls and menus. Keyboard shortcuts and touch controls can differ between editions; check the help available in your installed build.",
  },
  {
    title: "Your saves",
    text: "Back up your saves before updating. Browser and downloaded editions can store progress differently. Do not clear browser site data if it contains progress you want to keep.",
  },
  {
    title: "Quests & exploration",
    text: "Follow the objectives and dialogue in your current build. Exact quest requirements depend on the version; a verified walkthrough has not been published on this site yet.",
  },
  {
    title: "Time & mechanics",
    text: "Check the time and available actions shown in the game. A detailed, version-specific mechanics guide will be added when its instructions are confirmed.",
  },
  {
    title: "Need a hand?",
    text: "For installation or loading issues, share the game version, platform and error message with the official Discord. Do not bypass security warnings for files from unofficial sources.",
  },
];
