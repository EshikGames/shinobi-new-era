import "server-only";
import { randomToken, tokenHash } from "./security.mjs";
import { sessionCookieName } from "./config";
import { isSessionCurrent } from "./session-validity.mjs";

const SESSION_SECONDS = 24 * 60 * 60;

export async function createSupporterSession(db, accountId) {
  const token = randomToken();
  const { error } = await db.from("supporter_sessions").insert({
    token_hash: tokenHash(token),
    account_id: accountId,
    expires_at: new Date(Date.now() + SESSION_SECONDS * 1000).toISOString(),
  });
  if (error) throw new Error("Session creation failed");
  return token;
}

export async function readSupporterSession(request, db, config) {
  const token = request.cookies.get(sessionCookieName(config))?.value;
  if (!token || token.length > 128) return null;
  const { data, error } = await db.from("supporter_sessions")
    .select("account_id,expires_at,revoked_at")
    .eq("token_hash", tokenHash(token)).maybeSingle();
  if (error) throw new Error("Session lookup failed");
  if (!isSessionCurrent(data)) return null;
  return { ...data, token };
}

export async function revokeSupporterSession(db, token) {
  if (!token || token.length > 128) return;
  const { error } = await db.from("supporter_sessions")
    .update({ revoked_at: new Date().toISOString() })
    .eq("token_hash", tokenHash(token)).is("revoked_at", null);
  if (error) throw new Error("Session revocation failed");
}

export function setSupporterCookie(response, config, token) {
  response.cookies.set(sessionCookieName(config), token, {
    httpOnly: true, secure: config.secureCookie, sameSite: "lax", path: "/", maxAge: SESSION_SECONDS,
  });
}

export function clearSupporterCookie(response, config) {
  response.cookies.set(sessionCookieName(config), "", {
    httpOnly: true, secure: config.secureCookie, sameSite: "lax", path: "/", maxAge: 0,
  });
}
