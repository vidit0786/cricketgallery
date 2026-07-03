import { getServerSession } from "next-auth";

import { authOptions } from "@/server/auth/auth-options";
import { logger } from "@/server/observability/logger";
import { AppError } from "@/utils/api-errors";

/**
 * Safely reads the current session.
 * In production, a missing/misconfigured auth/database environment should not
 * crash protected pages into the global error UI; protected pages can redirect
 * to sign-in and API routes can return 401/JSON instead.
 */
export async function getCurrentUser() {
  try {
    const session = await getServerSession(authOptions);
    return session?.user ?? null;
  } catch (error) {
    logger.error("auth_session_read_failed", error);
    return null;
  }
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user?.id) {
    throw new AppError("You must be signed in to access this resource.", 401, "INVALID_REQUEST");
  }

  return user;
}
