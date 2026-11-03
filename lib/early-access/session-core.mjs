import { tokenHash } from "./security.mjs";
import { isSessionCurrent } from "./session-validity.mjs";

export async function resolveSupporterSession(token, lookup, now = Date.now()) {
  if (typeof token !== "string" || !/^[A-Za-z0-9_-]{43}$/.test(token)) return null;
  const data = await lookup(tokenHash(token));
  if (!data?.account_id || !isSessionCurrent(data, now)) return null;
  return { ...data, token };
}
