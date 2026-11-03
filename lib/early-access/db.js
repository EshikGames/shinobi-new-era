import "server-only";
import { createClient } from "@supabase/supabase-js";

export function createEarlyAccessDb(config) {
  return createClient(config.supabaseUrl, config.supabaseKey, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
    global: { headers: { "X-Client-Info": "sne-early-access" } },
  });
}

export async function audit(db, action, outcome, accountId = null) {
  const { error } = await db.from("early_access_audit_events").insert({ action, outcome, account_id: accountId });
  if (error) throw new Error("Audit write failed");
}

export async function consumeRateLimit(db, keyHash, maxHits, windowSeconds) {
  const { data, error } = await db.rpc("consume_early_access_rate_limit", {
    p_key_hash: keyHash, p_max_hits: maxHits, p_window_seconds: windowSeconds,
  });
  if (error) throw new Error("Rate limit unavailable");
  return data === true;
}
