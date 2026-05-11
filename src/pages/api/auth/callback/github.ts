import type { NextApiRequest, NextApiResponse } from "next";

import { createSessionToken } from "../../../../server/auth";
import {
  exchangeGithubCode,
  fetchGithubProfile,
  getAppBaseUrl,
} from "../../../../server/oauth/github";
import {
  clearOAuthStateCookie,
  setSessionCookie,
} from "../../../../server/oauth/session-cookie";
import {
  clearOAuthReturnCookie,
  readOAuthReturnCookie,
} from "../../../../server/oauth/state-cookie";
import { prisma } from "../../../../server/db";

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

  const base = getAppBaseUrl();
  const code = typeof req.query.code === "string" ? req.query.code : null;
  const state = typeof req.query.state === "string" ? req.query.state : null;
  const cookieState = readCookie(req.headers.cookie, "oauth_state");

  if (!code || !state || state !== cookieState) {
    clearOAuthStateCookie(res);
    clearOAuthReturnCookie(res);
    return res.redirect(302, `${base}/?error=oauth`);
  }

  clearOAuthStateCookie(res);

  const returnTo = readOAuthReturnCookie(req.headers.cookie);
  clearOAuthReturnCookie(res);

  try {
    const { accessToken, scope } = await exchangeGithubCode(code);
    const { githubUser, primaryEmail } = await fetchGithubProfile(accessToken);
    const providerAccountId = String(githubUser.id);

    const existingAccount = await prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider: "github",
          providerAccountId,
        },
      },
      include: { user: true },
    });

    let user;
    if (existingAccount) {
      user = await prisma.user.update({
        where: { id: existingAccount.userId },
        data: {
          name: githubUser.name ?? githubUser.login,
          email: primaryEmail ?? existingAccount.user.email,
          image: githubUser.avatar_url,
        },
      });
      await prisma.account.update({
        where: { id: existingAccount.id },
        data: {
          access_token: accessToken,
          scope: scope ?? null,
          token_type: "bearer",
          type: "oauth",
        },
      });
    } else {
      user = await prisma.user.create({
        data: {
          name: githubUser.name ?? githubUser.login,
          email: primaryEmail ?? undefined,
          image: githubUser.avatar_url,
          accounts: {
            create: {
              type: "oauth",
              provider: "github",
              providerAccountId,
              access_token: accessToken,
              token_type: "bearer",
              scope: scope ?? undefined,
            },
          },
        },
      });
    }

    const token = await createSessionToken(user.id);
    setSessionCookie(res, token);

    const dest = returnTo ?? "/admin";
    return res.redirect(302, `${base}${dest.startsWith("/") ? dest : `/${dest}`}`);
  } catch {
    return res.redirect(302, `${base}/?error=oauth`);
  }
}
