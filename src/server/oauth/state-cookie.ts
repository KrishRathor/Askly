import type { NextApiResponse } from "next";

const RETURN_COOKIE = "oauth_return";

export function setOAuthReturnCookie(
  res: NextApiResponse,
  returnTo: string | undefined
): void {
  if (!returnTo || !returnTo.startsWith("/") || returnTo.startsWith("//")) {
    return;
  }
  const secure = process.env.NODE_ENV === "production";
  const segments = [
    `${RETURN_COOKIE}=${encodeURIComponent(returnTo)}`,
    "Path=/",
    "Max-Age=600",
    "HttpOnly",
    "SameSite=Lax",
  ];
  if (secure) segments.push("Secure");
  res.appendHeader("Set-Cookie", segments.join("; "));
}

export function readOAuthReturnCookie(
  cookieHeader: string | undefined
): string | undefined {
  if (!cookieHeader) return undefined;
  for (const part of cookieHeader.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    if (key !== RETURN_COOKIE) continue;
    const value = decodeURIComponent(part.slice(idx + 1).trim());
    if (value.startsWith("/") && !value.startsWith("//")) return value;
  }
  return undefined;
}

export function clearOAuthReturnCookie(res: NextApiResponse): void {
  const secure = process.env.NODE_ENV === "production";
  const segments = [
    `${RETURN_COOKIE}=`,
    "Path=/",
    "Max-Age=0",
    "HttpOnly",
    "SameSite=Lax",
  ];
  if (secure) segments.push("Secure");
  res.appendHeader("Set-Cookie", segments.join("; "));
}
