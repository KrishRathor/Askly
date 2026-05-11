import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { Session } from "../types/auth";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type AuthContextValue = {
  data: Session | null;
  status: AuthStatus;
  signIn: (returnTo?: string) => void;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchSession(): Promise<Session | null> {
  const res = await fetch("/api/auth/session", { credentials: "include" });
  if (!res.ok) return null;
  return (await res.json()) as Session | null;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [data, setData] = useState<Session | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    let cancelled = false;
    fetchSession()
      .then((session) => {
        if (cancelled) return;
        setData(session);
        setStatus(session?.user ? "authenticated" : "unauthenticated");
      })
      .catch(() => {
        if (cancelled) return;
        setData(null);
        setStatus("unauthenticated");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback((returnTo?: string) => {
    const q = returnTo
      ? `?returnTo=${encodeURIComponent(returnTo)}`
      : "";
    window.location.href = `/api/auth/github${q}`;
  }, []);

  const signOut = useCallback(async () => {
    await fetch("/api/auth/signout", { method: "POST", credentials: "include" });
    setData(null);
    setStatus("unauthenticated");
  }, []);

  const value = useMemo(
    () => ({ data, status, signIn, signOut }),
    [data, status, signIn, signOut]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
