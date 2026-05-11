import type { NextApiRequest, NextApiResponse } from "next";

import {
  buildClearOAuthStateCookieHeader,
  buildClearSessionCookieHeader,
  buildSessionCookieHeader,
  getOAuthRedirectBaseUrl,
  parseCookies,
  signSessionToken,
} from "@/server/auth";
import {
  exchangeGitHubCode,
  fetchGitHubProfile,
  upsertUserFromGitHub,
} from "@/server/github-auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).end();
  }

  const baseUrl = getOAuthRedirectBaseUrl();
  const errorRedirect = `${baseUrl}/?error=oauth`;

  const { code, state } = req.query;
  if (typeof code !== "string" || typeof state !== "string") {
    res.setHeader("Set-Cookie", buildClearOAuthStateCookieHeader());
    return res.redirect(302, errorRedirect);
  }

  const cookies = parseCookies(req.headers.cookie);
  if (!cookies["oauth_state"] || cookies["oauth_state"] !== state) {
    res.setHeader("Set-Cookie", buildClearOAuthStateCookieHeader());
    return res.redirect(302, errorRedirect);
  }

  const redirectUri = `${baseUrl}/api/auth/callback/github`;

  try {
    const accessToken = await exchangeGitHubCode(code, redirectUri);
    const profile = await fetchGitHubProfile(accessToken);
    const userId = await upsertUserFromGitHub(profile, accessToken);
    const sessionToken = signSessionToken(userId);

    res.setHeader("Set-Cookie", [
      buildSessionCookieHeader(sessionToken),
      buildClearOAuthStateCookieHeader(),
    ]);
    return res.redirect(302, `${baseUrl}/admin`);
  } catch {
    res.setHeader("Set-Cookie", [
      buildClearSessionCookieHeader(),
      buildClearOAuthStateCookieHeader(),
    ]);
    return res.redirect(302, errorRedirect);
  }
}
