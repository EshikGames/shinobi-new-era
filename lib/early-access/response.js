import "server-only";
import { NextResponse } from "next/server";

export function privateJson(body, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" },
  });
}

export function safeRedirect(url) {
  const response = NextResponse.redirect(url, 303);
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export function sameOrigin(request, origin) {
  return request.headers.get("origin") === origin;
}
