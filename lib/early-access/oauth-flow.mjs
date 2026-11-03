import { safeTokenEqual, tokenHash } from "./security.mjs";

export class OAuthFlowError extends Error {
  constructor(code) {
    super(code);
    this.code = code;
  }
}

export async function completePatreonOAuth({ suppliedState, cookieState, code, consumeState, exchangeCode, fetchIdentity, storeAccount, createSession, auditSuccess }) {
  if (suppliedState?.length !== 43 || cookieState?.length !== 43 ||
      !safeTokenEqual(suppliedState, cookieState) || !code || code.length > 2048) {
    throw new OAuthFlowError("invalid_callback");
  }
  if (!(await consumeState(tokenHash(suppliedState)))) throw new OAuthFlowError("expired_or_reused_state");
  const tokens = await exchangeCode(code);
  const identity = await fetchIdentity(tokens.access_token);
  const accountId = await storeAccount(identity, tokens);
  const sessionToken = await createSession(accountId);
  await auditSuccess(accountId);
  return { accountId, sessionToken };
}
