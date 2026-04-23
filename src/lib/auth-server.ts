import { auth } from "./auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user ?? null;
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  return session;
}

export async function requireUserId() {
  const session = await requireAuth();
  return session.user.id;
}

/** Returns the authenticated user's ID, or null if not authenticated.
 *  Use this in API routes where redirect() is not appropriate. */
export async function getUserId(): Promise<string | null> {
  const session = await getSession();
  return session?.user?.id ?? null;
}
