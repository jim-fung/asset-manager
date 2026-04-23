import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function getSession() {
  return await auth();
}

export async function getCurrentUser() {
  const session = await auth();
  if (!session.userId) return null;
  const client = await clerkClient();
  const user = await client.users.getUser(session.userId);
  return {
    id: user.id,
    email: user.emailAddresses[0]?.emailAddress ?? null,
    name: user.fullName ?? user.username ?? null,
    image: user.imageUrl ?? null,
  };
}

export async function requireAuth() {
  const session = await auth();
  if (!session.userId) {
    redirect("/sign-in");
  }
  return session;
}

export async function requireUserId() {
  const session = await requireAuth();
  return session.userId;
}

export async function getUserId(): Promise<string | null> {
  const session = await auth();
  return session.userId ?? null;
}
