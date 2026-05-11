import type { NextApiResponse } from "next";

import { SESSION_COOKIE } from "../auth";

const THIRTY_DAYS = 60 * 60 * 24 * 30;

export function setSessionCookie(res: NextApiResponse, token: string): void {
  const secure = process.env.NODE_ENV === "production";
  const segments = [
    `${SESSION_COOKIE}=${encodeURIComponent(token)}`,
    "Path=/",
    `Max-Age=${THIRTY_DAYS}`,
    "HttpOnly",
    "SameSite=Lax",
  ];
  if (secure) segments.push("Secure");
  res.setHeader("Set-Cookie", segments.join("; "));
}

export function clearSessionCookie(res: NextApiResponse): void {
  const secure = process.env.NODE_ENV === "production";
  const segments = [
    `${SESSION_COOKIE}=`,
    "Path=/",
    "Max-Age=0",
    "HttpOnly",
    "SameSite=Lax",
  ];
  if (secure) segments.push("Secure");
  res.setHeader("Set-Cookie", segments.join("; "));
}

export function setOAuthStateCookie(res: NextApiResponse, state: string): void {
  const secure = process.env.NODE_ENV === "production";
  const segments = [
    `oauth_state=${encodeURIComponent(state)}`,
    "Path=/",
    "Max-Age=600",
    "HttpOnly",
    "SameSite=Lax",
  ];
  if (secure) segments.push("Secure");
  res.appendHeader("Set-Cookie", segments.join("; "));
}

export function clearOAuthStateCookie(res: NextApiResponse): void {
  const secure = process.env.NODE_ENV === "production";
  const segments = [
    "oauth_state=",
    "Path=/",
    "Max-Age=0",
    "HttpOnly",
    "SameSite=Lax",
  ];
  if (secure) segments.push("Secure");
  res.appendHeader("Set-Cookie", segments.join("; "));
}
