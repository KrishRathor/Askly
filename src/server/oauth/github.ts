import { env } from "../../env.mjs";

export function getAppBaseUrl(): string {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return env.AUTH_URL;
}

export function githubAuthorizeUrl(state: string): string {
  const base = getAppBaseUrl();
  const params = new URLSearchParams({
    client_id: env.GITHUB_CLIENT_ID,
    redirect_uri: `${base}/api/auth/callback/github`,
    scope: "read:user user:email",
    state,
  });
  return `https://github.com/login/oauth/authorize?${params.toString()}`;
}

export async function exchangeGithubCode(code: string): Promise<{
  accessToken: string;
  scope?: string;
}> {
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
      redirect_uri: `${getAppBaseUrl()}/api/auth/callback/github`,
    }),
  });

  const data = (await res.json()) as {
    access_token?: string;
    scope?: string;
    error?: string;
    error_description?: string;
  };

  if (!data.access_token) {
    throw new Error(
      data.error_description ?? data.error ?? "GitHub token exchange failed"
    );
  }

  return { accessToken: data.access_token, scope: data.scope };
}

type GithubUser = {
  id: number;
  login: string;
  name: string | null;
  email: string | null;
  avatar_url: string;
};

type GithubEmail = {
  email: string;
  primary: boolean;
  verified: boolean;
};

export async function fetchGithubProfile(accessToken: string): Promise<{
  githubUser: GithubUser;
  primaryEmail: string | null;
}> {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    Accept: "application/vnd.github+json",
  };

  const userRes = await fetch("https://api.github.com/user", { headers });
  if (!userRes.ok) {
    throw new Error("Failed to load GitHub user");
  }
  const githubUser = (await userRes.json()) as GithubUser;

  const emailRes = await fetch("https://api.github.com/user/emails", {
    headers,
  });
  let primaryEmail: string | null = githubUser.email;
  if (emailRes.ok) {
    const emails = (await emailRes.json()) as GithubEmail[];
    const fromList =
      emails.find((e) => e.primary && e.verified)?.email ??
      emails.find((e) => e.primary)?.email ??
      emails.find((e) => e.verified)?.email ??
      emails[0]?.email;
    primaryEmail = fromList ?? primaryEmail;
  }

  return { githubUser, primaryEmail };
}
