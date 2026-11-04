// Public presentation only: never use this catalog to grant download access.
// Verified against the creator's Patreon membership page on 2026-11-04.
export const membershipSource = "https://www.patreon.com/cw/eshikgames/membership";
export const membershipCheckedAt = "2026-11-04";
export const supporterTiers = [
  {
    id: "28672974", name: "Village Ally", monthlyUsd: "1.99", earlyAccessDays: null,
    benefits: ["Development posts and progress updates", "Sneak peeks and previews", "Community polls", "Supporter Discord role and channels"],
    includes: ["community"],
  },
  {
    id: "29743556", name: "Karma Bearer", monthlyUsd: "4.99", earlyAccessDays: null,
    benefits: ["Everything in Village Ally", "New supporter builds on Patreon", "Extra previews and work-in-progress screenshots", "Behind-the-scenes content and additional polls", "Karma Bearer Discord role"],
    includes: ["community", "builds"],
  },
  {
    id: "29743574", name: "Resonance Adept", monthlyUsd: "8.90", earlyAccessDays: 14,
    benefits: ["Everything in the previous tiers", "14-day Early Access to future updates", "Gallery Unlocker", "Bonus and unused CGs, bonus CG animations", "Cut and experimental content", "Access to #talk-with-dev and higher feedback priority", "Resonance Adept Discord role"],
    includes: ["community", "builds", "early", "gallery", "bonus", "feedback"],
  },
  {
    id: "29743581", name: "Otsutsuki Chosen", monthlyUsd: "19.90", earlyAccessDays: 14,
    benefits: ["Everything in the previous tiers", "Request one custom non-canon CG", "Suggest the character, outfit, location and pose", "Exclusive development materials", "Otsutsuki Chosen Discord role"],
    caveat: "Limited slots. Custom requests require creator approval and may be shared as bonus supporter content.",
    includes: ["community", "builds", "early", "gallery", "bonus", "feedback", "materials", "customCg"],
  },
  {
    id: "29743595", name: "New Era Architect", monthlyUsd: "49.90", earlyAccessDays: 14,
    benefits: ["Everything in the previous tiers", "Collaborate on one custom non-canon bonus scene", "Discuss the concept, characters, outfits and location", "Approximately 3–5 CGs or animated shots, depending on complexity", "New Era Architect Discord role", "Optional mention in supporter credits"],
    caveat: "Very limited slots. Custom content requires creator approval, must follow the project rules and does not automatically become part of the main game.",
    includes: ["community", "builds", "early", "gallery", "bonus", "feedback", "materials", "customCg", "customScene"],
  },
];
export const membershipComparison = [
  { key: "early", label: "Early Access", detail: "Future updates, before the public release" },
  { key: "builds", label: "Supporter builds", detail: "Delivered through Patreon; separate from website Early Access" },
  { key: "gallery", label: "Gallery Unlocker", detail: "Verified inside the game" },
  { key: "bonus", label: "Bonus CGs & animations", detail: "Also includes cut and experimental content" },
  { key: "community", label: "Supporter Discord & polls", detail: "Supporter roles, channels and community polls" },
  { key: "feedback", label: "Talk with the developer", detail: "#talk-with-dev and higher feedback priority" },
  { key: "materials", label: "Exclusive development materials" },
  { key: "customCg", label: "Custom CG request", detail: "Non-canon; subject to approval" },
  { key: "customScene", label: "Custom bonus scene", detail: "Non-canon; subject to approval" },
];
