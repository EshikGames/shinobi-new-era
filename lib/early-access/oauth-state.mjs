export async function consumeOAuthState(db, stateHash) {
  const { data, error } = await db.rpc("consume_supporter_oauth_state", { p_state_hash: stateHash });
  if (error) throw new Error("OAuth state lookup failed");
  return data === true;
}
