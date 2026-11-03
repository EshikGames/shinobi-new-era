import "server-only";
import { EARLY_ACCESS_SUPABASE_PROJECT_REF, EARLY_ACCESS_SUPABASE_URL, isEarlyAccessSupabaseTarget } from "./project.mjs";

const required = [
  "SITE_URL", "SUPABASE_PROJECT_REF", "SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY",
  "SUPPORTER_TOKEN_ENCRYPTION_KEY", "PATREON_CLIENT_ID",
  "PATREON_CLIENT_SECRET", "PATREON_CAMPAIGN_ID", "PATREON_ALLOWED_TIER_IDS",
];
export function getEarlyAccessConfig() {
  if (process.env.EARLY_ACCESS_AUTH_ENABLED !== "true" || required.some((key) => !process.env[key])) return null;
  try {
    const site = new URL(process.env.SITE_URL);
    const encryptionKey = Buffer.from(process.env.SUPPORTER_TOKEN_ENCRYPTION_KEY, "base64");
    const tiers = process.env.PATREON_ALLOWED_TIER_IDS.split(",").map((tier) => tier.trim()).filter(Boolean);
    if (site.pathname !== "/" || site.search || site.hash || !["https:", "http:"].includes(site.protocol)) return null;
    if (site.protocol !== "https:" && !(process.env.NODE_ENV !== "production" && site.hostname === "localhost")) return null;
    if (!isEarlyAccessSupabaseTarget(process.env.SUPABASE_PROJECT_REF, process.env.SUPABASE_URL)) return null;
    if (encryptionKey.length !== 32 || tiers.length === 0) return null;
    return {
      siteOrigin: site.origin,
      projectRef: EARLY_ACCESS_SUPABASE_PROJECT_REF,
      supabaseUrl: EARLY_ACCESS_SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      encryptionKey,
      patreonClientId: process.env.PATREON_CLIENT_ID,
      patreonClientSecret: process.env.PATREON_CLIENT_SECRET,
      campaignId: process.env.PATREON_CAMPAIGN_ID,
      allowedTierIds: tiers,
      callbackUrl: `${site.origin}/api/auth/patreon/callback`,
      bucket: "early-access-builds",
      secureCookie: site.protocol === "https:",
    };
  } catch {
    return null;
  }
}

export function sessionCookieName(config) {
  return config.secureCookie ? "__Host-sne_supporter" : "sne_supporter_dev";
}

export function stateCookieName(config) {
  return config.secureCookie ? "__Host-sne_oauth_state" : "sne_oauth_state_dev";
}
