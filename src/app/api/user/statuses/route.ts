import { db } from "@/db";
import { userImageStatuses } from "@/db/schema";
import type { ImageStatus } from "@/data/imageData";
import { eq } from "drizzle-orm";
import { createAuthenticatedGetHandler } from "@/lib/api-utils";

export const GET = createAuthenticatedGetHandler(async (userId) => {
  const statuses = await db
    .select()
    .from(userImageStatuses)
    .where(eq(userImageStatuses.userId, userId));

  const statusMap: Record<string, ImageStatus> = {};
  for (const status of statuses) {
    statusMap[status.imageId] = status.status;
  }
  return statusMap;
}, "Error fetching statuses:");
