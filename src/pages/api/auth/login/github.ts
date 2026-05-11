import type { NextApiRequest, NextApiResponse } from "next";
import { randomBytes } from "crypto";

import {
  buildOAuthStateCookieHeader,
  getOAuthRedirectBaseUrl,
} from "@/server/auth";
import { env } from "@/env.mjs";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).end();
  }

  const state = randomBytes(16).toString("hex");
  const baseUrl = getOAuthRedirectBaseUrl();
  const redirectUri = `${baseUrl}/api/auth/callback/github`;

  res.setHeader("Set-Cookie", buildOAuthStateCookieHeader(state));

  const params = new URLSearchParams({
    client_id: env.GITHUB_CLIENT_ID,
    redirect_uri: redirectUri,
    scope: "read:user user:email",
    state,
  });
  const qs = params.toString();

  return res.redirect(302, `https://github.com/login/oauth/authorize?${qs}`);
}
