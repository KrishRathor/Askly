import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import type { Session } from "@/server/auth-types";

type SessionStatus = "loading" | "authenticated" | "unauthenticated";

type SessionContextValue = {
  data: Session | null;
  status: SessionStatus;
  update: () => Promise<Session | null>;
};

const SessionContext = createContext<SessionContextValue | undefined>(
  undefined,
);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [data, setData] = useState<Session | null>(null);
  const [status, setStatus] = useState<SessionStatus>("loading");

  const update = useCallback(async () => {
    const res = await fetch("/api/auth/session");
    if (!res.ok) {
      setData(null);
      setStatus("unauthenticated");
      return null;
    }
    const json = (await res.json()) as Session | null;
    setData(json);
    setStatus(json?.user ? "authenticated" : "unauthenticated");
    return json;
  }, []);

  useEffect(() => {
    void update();
  }, [update]);

  return (
    <SessionContext.Provider value={{ data, status, update }}>
      {children}
    </SessionContext.Provider>
  );
};

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error("useSession must be used within SessionProvider");
  }
  return ctx;
}

export function signIn(): void {
  window.location.href = "/api/auth/login/github";
}

export async function signOut(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST" });
  window.location.href = "/";
}
