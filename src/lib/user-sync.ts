import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth-server";

export async function ensureUserInDb(): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;

  const existing = await db.select().from(users).where(eq(users.id, user.id));
  if (existing.length > 0) return;

  await db.insert(users).values({
    id: user.id,
    email: user.email ?? `no-email-${user.id}@placeholder.local`,
    name: user.name,
    image: user.image,
  });
}
