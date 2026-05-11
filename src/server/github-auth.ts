import { env } from "../env.mjs";
import { prisma } from "./db";

export async function exchangeGitHubCode(
  code: string,
  redirectUri: string,
): Promise<string> {
  const res = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: redirectUri,
    }),
  });
  if (!res.ok) throw new Error("token_exchange_failed");
  const data = (await res.json()) as {
    access_token?: string;
    error?: string;
    error_description?: string;
  };
  if (!data.access_token || data.error) throw new Error("token_exchange_failed");
  return data.access_token;
}

export type GitHubProfile = {
  id: number;
  login: string;
  email: string | null;
  name: string | null;
  avatar_url: string | null;
};

export async function fetchGitHubProfile(
  accessToken: string,
): Promise<GitHubProfile> {
  const res = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  if (!res.ok) throw new Error("github_user_failed");
  return res.json() as Promise<GitHubProfile>;
}

async function resolvePrimaryEmail(
  accessToken: string,
  profileEmail: string | null,
): Promise<string | null> {
  if (profileEmail) return profileEmail;
  const emailsRes = await fetch("https://api.github.com/user/emails", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  if (!emailsRes.ok) return null;
  const emails = (await emailsRes.json()) as {
    email: string;
    primary?: boolean;
    verified?: boolean;
  }[];
  const primary = emails.find((e) => e.primary && e.verified);
  return primary?.email ?? emails.find((e) => e.verified)?.email ?? null;
}

/**
 * Create or update Prisma `User` / `Account` for a GitHub OAuth login.
 */
export async function upsertUserFromGitHub(
  profile: GitHubProfile,
  accessToken: string,
): Promise<string> {
  const providerAccountId = String(profile.id);

  const existing = await prisma.account.findUnique({
    where: {
      provider_providerAccountId: {
        provider: "github",
        providerAccountId,
      },
    },
  });

  if (existing) {
    await prisma.account.update({
      where: { id: existing.id },
      data: {
        access_token: accessToken,
        type: "oauth",
        provider: "github",
      },
    });
    await prisma.user.update({
      where: { id: existing.userId },
      data: {
        name: profile.name,
        email: profile.email ?? undefined,
        image: profile.avatar_url,
      },
    });
    return existing.userId;
  }

  const email =
    (await resolvePrimaryEmail(accessToken, profile.email)) ??
    `${profile.id}+${profile.login}@users.noreply.github.com`;

  const userByEmail = await prisma.user.findUnique({
    where: { email },
  });

  if (userByEmail) {
    await prisma.account.create({
      data: {
        userId: userByEmail.id,
        type: "oauth",
        provider: "github",
        providerAccountId,
        access_token: accessToken,
      },
    });
    await prisma.user.update({
      where: { id: userByEmail.id },
      data: {
        name: profile.name ?? userByEmail.name,
        image: profile.avatar_url ?? userByEmail.image,
      },
    });
    return userByEmail.id;
  }

  const user = await prisma.user.create({
    data: {
      name: profile.name,
      email,
      image: profile.avatar_url,
      accounts: {
        create: {
          type: "oauth",
          provider: "github",
          providerAccountId,
          access_token: accessToken,
        },
      },
    },
  });
  return user.id;
}
