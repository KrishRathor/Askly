import type { GetServerSidePropsContext } from "next";
import { SignJWT, jwtVerify } from "jose";

import { env } from "../env.mjs";
import type { Session } from "../types/auth";
import { prisma } from "./db";

export type { Session } from "../types/auth";

export const SESSION_COOKIE = "askly_session";

function getJwtSecret(): Uint8Array {
  const secret = env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET (or NEXTAUTH_SECRET) must be set");
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(userId: string): Promise<string> {
  return await new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(getJwtSecret());
}

export async function verifySessionToken(
  token: string
): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret(), {
      algorithms: ["HS256"],
    });
    return typeof payload.sub === "string" ? payload.sub : null;
  } catch {
    return null;
  }
}

function readCookie(
  cookieHeader: string | undefined,
  name: string
): string | undefined {
  if (!cookieHeader) return undefined;
  for (const part of cookieHeader.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    if (key !== name) continue;
    return decodeURIComponent(part.slice(idx + 1).trim());
  }
  return undefined;
}

/**
 * Resolve the current session from the signed session cookie (GitHub OAuth).
 */
export const getServerAuthSession = async (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}): Promise<Session | null> => {
  const raw = readCookie(ctx.req.headers.cookie, SESSION_COOKIE);
  if (!raw) return null;

  const userId = await verifySessionToken(raw);
  if (!userId) return null;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return null;

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
    },
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  };
};
