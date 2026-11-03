import { randomToken, tokenHash } from "./security.mjs";

export const OAUTH_STATE_TTL_SECONDS = 600;

export function createOAuthState(now = Date.now()) {
  const state = randomToken();
  return {
    state,
    record: { state_hash: tokenHash(state), expires_at: new Date(now + OAUTH_STATE_TTL_SECONDS * 1000).toISOString() },
  };
}

export async function consumeOAuthState(db, stateHash) {
  const { data, error } = await db.rpc("consume_supporter_oauth_state", { p_state_hash: stateHash });
  if (error) throw new Error("OAuth state lookup failed");
  return data === true;
}
