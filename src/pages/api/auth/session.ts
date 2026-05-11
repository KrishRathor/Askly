import type { NextApiRequest, NextApiResponse } from "next";

import { verifySessionToken, SESSION_COOKIE } from "../../../server/auth";
import { prisma } from "../../../server/db";

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).end();
  }

  const raw = readCookie(req.headers.cookie, SESSION_COOKIE);
  if (!raw) {
    return res.status(200).json(null);
  }

  const userId = await verifySessionToken(raw);
  if (!userId) {
    return res.status(200).json(null);
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return res.status(200).json(null);
  }

  return res.status(200).json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
    },
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  });
}
