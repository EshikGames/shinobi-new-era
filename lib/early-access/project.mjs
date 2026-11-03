export const EARLY_ACCESS_SUPABASE_PROJECT_REF = "avdkvtmugeizoqqvayek";
export const EARLY_ACCESS_SUPABASE_URL = `https://${EARLY_ACCESS_SUPABASE_PROJECT_REF}.supabase.co`;

export function isEarlyAccessSupabaseTarget(projectRef, url) {
  if (projectRef !== EARLY_ACCESS_SUPABASE_PROJECT_REF || typeof url !== "string") return false;
  try {
    return new URL(url).href === `${EARLY_ACCESS_SUPABASE_URL}/`;
  } catch {
    return false;
  }
}
