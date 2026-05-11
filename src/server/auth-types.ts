/**
 * App session shape (aligned with former NextAuth `Session` usage in tRPC and UI).
 */
export type Session = {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
};
