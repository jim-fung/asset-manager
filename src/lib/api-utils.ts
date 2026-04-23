import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth-server";

type HandlerFn<T> = (userId: string) => Promise<T>;

/**
 * Creates an authenticated GET handler for API routes.
 * Handles userId resolution and error handling boilerplate.
 */
export function createAuthenticatedGetHandler<T>(
  handler: HandlerFn<T>,
  errorMessage: string
) {
  return async () => {
    try {
      const userId = await getUserId();
      if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const result = await handler(userId);
      return NextResponse.json(result);
    } catch (error) {
      console.error(errorMessage, error);
      return NextResponse.json({}, { status: 500 });
    }
  };
}
