import type { NextApiRequest, NextApiResponse } from "next";
import { randomBytes } from "crypto";

import { githubAuthorizeUrl } from "../../../server/oauth/github";
import { setOAuthStateCookie } from "../../../server/oauth/session-cookie";
import { setOAuthReturnCookie } from "../../../server/oauth/state-cookie";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).end();
  }

  const state = randomBytes(24).toString("hex");
  setOAuthStateCookie(res, state);

  const returnTo =
    typeof req.query.returnTo === "string" ? req.query.returnTo : undefined;
  setOAuthReturnCookie(res, returnTo);

  res.redirect(302, githubAuthorizeUrl(state));
}
