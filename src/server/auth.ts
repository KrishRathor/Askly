import type { GetServerSidePropsContext } from "next";
import type { NextApiRequest } from "next";
import { createHmac, timingSafeEqual } from "crypto";

import type { Session } from "./auth-types";
import { env } from "../env.mjs";
import { prisma } from "./db";

export const SESSION_COOKIE_NAME = "askly.session";

const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 30;

type SessionTokenPayload = {
  userId: string;
  exp: number;
};

function getAuthSecret(): string {
  return (
    env.NEXTAUTH_SECRET ??
    "development-only-insecure-secret-do-not-use-in-production"
  );
}

function getAppBaseUrl(): string {
  const url = env.NEXTAUTH_URL;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
}

/** Public site URL (OAuth redirect_uri, post-login redirects). */
export function getOAuthRedirectBaseUrl(): string {
  return getAppBaseUrl();
}

export function signSessionToken(userId: string): string {
  const secret = getAuthSecret();
  const payload: SessionTokenPayload = {
    userId,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SEC,
  };
  const data = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const sig = createHmac("sha256", secret).update(data).digest("base64url");
  return `${data}.${sig}`;
}

export function verifySessionToken(token: string): SessionTokenPayload | null {
  const secret = getAuthSecret();
  const dot = token.indexOf(".");
  if (dot === -1) return null;
  const data = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!data || !sig) return null;
  const expected = createHmac("sha256", secret).update(data).digest("base64url");
  try {
    if (
      sig.length !== expected.length ||
      !timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
    ) {
      return null;
    }
  } catch {
    return null;
  }
  try {
    const payload = JSON.parse(
      Buffer.from(data, "base64url").toString("utf8"),
    ) as SessionTokenPayload;
    if (typeof payload.userId !== "string" || typeof payload.exp !== "number")
      return null;
    if (payload.exp < Date.now() / 1000) return null;
    return payload;
  } catch {
    return null;
  }
}

export function parseCookies(
  cookieHeader: string | undefined,
): Record<string, string> {
  if (!cookieHeader) return {};
  const out: Record<string, string> = {};
  for (const part of cookieHeader.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const val = decodeURIComponent(part.slice(idx + 1).trim());
    out[key] = val;
  }
  return out;
}

function cookieFlags(): string[] {
  const flags = ["Path=/", "HttpOnly", "SameSite=Lax"];
  if (process.env.NODE_ENV === "production") flags.push("Secure");
  return flags;
}

export function buildSessionCookieHeader(token: string): string {
  const flags = cookieFlags();
  return [
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}`,
    `Max-Age=${SESSION_MAX_AGE_SEC}`,
    ...flags,
  ].join("; ");
}

export function buildClearSessionCookieHeader(): string {
  return [`${SESSION_COOKIE_NAME}=`, "Max-Age=0", ...cookieFlags()].join("; ");
}

export function buildOAuthStateCookieHeader(state: string): string {
  const flags = cookieFlags();
  return [`oauth_state=${encodeURIComponent(state)}`, "Max-Age=600", ...flags].join(
    "; ",
  );
}

export function buildClearOAuthStateCookieHeader(): string {
  return ["oauth_state=", "Max-Age=0", ...cookieFlags()].join("; ");
}

export async function getSessionFromRequest(
  req: NextApiRequest | GetServerSidePropsContext["req"],
): Promise<Session | null> {
  const cookies = parseCookies(req.headers.cookie);
  const raw = cookies[SESSION_COOKIE_NAME];
  if (!raw) return null;
  const token = verifySessionToken(raw);
  if (!token) return null;
  const user = await prisma.user.findUnique({
    where: { id: token.userId },
    select: { id: true, name: true, email: true, image: true },
  });
  if (!user) return null;
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
    },
  };
}

/**
 * Load the current session from the signed session cookie (server-side).
 */
export const getServerAuthSession = async (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getSessionFromRequest(ctx.req);
};
