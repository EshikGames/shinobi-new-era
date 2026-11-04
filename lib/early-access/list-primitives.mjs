// Shared validation for email-only access. No OTP or administrative endpoints.
export const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const TOKEN = /^[A-Za-z0-9_-]{43}$/;
export class ManualError extends Error {
  constructor(code, status = 403) { super(code); this.code = code; this.status = status; }
}
export function normalizeEmail(email) {
  if (typeof email !== 'string') return null;
  const value = email.trim().toLowerCase();
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? value : null;
}
