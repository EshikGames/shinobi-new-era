export function isSessionCurrent(row, now = Date.now()) {
  return Boolean(row && !row.revoked_at && Number.isFinite(Date.parse(row.expires_at)) && Date.parse(row.expires_at) > now);
}
