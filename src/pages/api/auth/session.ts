import type { NextApiRequest, NextApiResponse } from "next";

import { getSessionFromRequest } from "@/server/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).end();
  }

  const session = await getSessionFromRequest(req);
  return res.status(200).json(session);
}
