import { gameOverview, gameLanguages, publicBetaNote } from "./game-info.mjs";

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
  {
    "name": "Boruto",
    "image": "/images/characters/boruto-art-v2.png",
    "description": "Determined, stubborn and sometimes impulsive. After a long coma, he sets out to find Naruto and Sasuke while learning to control Karma."
  },
  {
    "name": "Momoshiki",
    "image": "/images/characters/momoshiki-art-v2.png",
    "description": "A proud, sharp-witted Otsutsuki woman whose consciousness resides within Boruto. She knows far more about Karma than he does; her intentions remain a mystery."
  },
  {
    "name": "Hinata",
    "image": "/images/characters/hinata-art-v2.png",
    "description": "Caring and quietly resolute. With Naruto missing, she tries to keep life at home steady in a world that no longer feels secure."
  },
  {
    "name": "Himawari",
    "image": "/images/characters/himawari-art-v2.png",
    "description": "At the heart of the home storyline. Rebuilding trust with Boruto is an important part of their connection."
  },
  {
    "name": "Sakura",
    "image": "/images/characters/sakura-art-v2.png",
    "description": "An experienced medical ninja who helps investigate unusual phenomena involving chakra."
  },
  {
    "name": "Sumire",
    "image": "/images/characters/sumire-art-v2.png",
    "description": "Observant, thoughtful and calm. Her role connects the medical storyline with ongoing research."
  },
  {
    "name": "Sarada",
    "image": "/images/characters/sarada-art-v2.png",
    "description": "An independent and capable kunoichi whose involvement in the story shapes her connection with Boruto."
  },
  {
    "name": "Kakashi",
    "image": null,
    "description": "An experienced shinobi involved in the investigation. He guides Boruto; further story missions are being developed for Act III."
  },
  {
    "name": "Ino",
    "image": null,
    "description": "Part of the investigation being developed for Act III, with the Yamanaka flower shop as a key setting in her storyline."
  }
];
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
  { question: "What is Shinobi New Era?", answer: "An 18+ open-world visual novel by Eshik Games, built with Ren’Py. " + gameOverview },
  { question: "Why is Act III missing from the public Beta?", answer: publicBetaNote },
  { question: "How do the public version and Early Access differ?", answer: "The public 0.4beta.fix build is available on itch.io. Website Early Access checks your active Patreon membership, eligible tier, a published build and its unlock date. A subscription does not create a download when no build has been published." },
  { question: "What do in-game supporter privileges unlock?", answer: "They unlock the in-game gallery. The game checks supporter status through email, separately from Patreon sign-in on this website. The public artwork gallery on this website is a third, separate page; it is not the in-game supporter gallery." },
  { question: "How do I check my subscription?", answer: "For website downloads, sign in with the Patreon account holding your subscription on Early Access and read the returned status. For the in-game gallery, use the game’s email-based supporter check and read the result in the game. Signing in here does not unlock the game’s gallery." },
  { question: "What if the game does not recognize my email?", answer: "Check for typing errors and confirm which email belongs to your supporter account. Check the subscription and payment status on the platform. If recognition still fails, contact Eshik Games through the official community links with the game version, platform and error message. Keep email addresses, receipts and account details out of public channels; never send passwords or tokens." },
  { question: "Does cancelling renewal immediately end my access?", answer: "Cancellation of future renewal and the end of a paid period are different events. Check your platform’s membership status and paid-through date. Website access follows the current Patreon membership returned during verification. The in-game gallery uses a separate check; ask Eshik Games if its result differs. No fixed grace period is promised here." },
  { question: "Where can I download the current public version?", answer: "Open Downloads for the official itch.io page and its 0.4beta.fix PC archive, Mac archive and Android APK. Previous v0.2b links stay in the archive with their original labels." },
  { question: "Which languages are available?", answer: `The public Beta lists 14 languages: ${gameLanguages.join(", ")}. Translation refinement continues.` },
  { question: "Is the browser edition the latest release?", answer: "No. The hosted browser archive identifies itself as v0.2b. It is an older edition, separate from the current public 0.4beta.fix download and the full v0.4 in development. Its saves and features can differ." },
  { question: "Is the 2.5D combat system finished?", answer: "It was first shown as a separate prototype. Work on combat belongs to the full v0.4 development plan; integration into the current main-game project has not been verified for this website. Do not expect it from the public Beta announcement." },
  { question: "When will full v0.4 be released?", answer: "Full v0.4, including Act III, is in development. No release date is confirmed here. Development posts describe work in progress, not a promise that a feature is already available." },
  { question: "Can I sign in with SubscribeStar or Boosty?", answer: "Neither platform currently has a working sign-in flow on this website. Their creator pages remain available for their own posts and subscription information." },
  { question: "Where should I report a bug?", answer: "Use the official Discord community or the game’s itch.io comments. Include your game version, operating system, language, the steps that caused the issue and the error message. Remove personal account information from screenshots and reports." },
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
