import type { NextApiRequest, NextApiResponse } from "next";

import { buildClearSessionCookieHeader } from "@/server/auth";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end();
  }

  res.setHeader("Set-Cookie", buildClearSessionCookieHeader());
  return res.status(200).json({ ok: true });
}
