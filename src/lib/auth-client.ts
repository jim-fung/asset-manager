import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // Must use NEXT_PUBLIC_ prefix for client-side access in Next.js
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
});
