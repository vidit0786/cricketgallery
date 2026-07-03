import { Prisma } from "@prisma/client";

import { prisma } from "@/server/database/prisma";
import type { IdentityProfile } from "@/types/identity-types";

export async function getIdentityProfile(userId: string, projectId: string, sourceImageHash: string) {
  const record = await prisma.identityProfile.findUnique({
    where: { userId_projectId_sourceImageHash: { userId, projectId, sourceImageHash } },
  });

  if (!record) return null;
  return { ...(record.profile as unknown as IdentityProfile), id: record.id, createdAt: record.createdAt.toISOString() };
}

export async function upsertIdentityProfile(userId: string, projectId: string, profile: IdentityProfile) {
  const record = await prisma.identityProfile.upsert({
    where: { userId_projectId_sourceImageHash: { userId, projectId, sourceImageHash: profile.sourceImageHash } },
    update: {
      profile: profile as unknown as Prisma.InputJsonValue,
      confidence: profile.confidence,
    },
    create: {
      userId,
      projectId,
      sourceImageHash: profile.sourceImageHash,
      profile: profile as unknown as Prisma.InputJsonValue,
      confidence: profile.confidence,
    },
  });

  return { ...profile, id: record.id, createdAt: record.createdAt.toISOString() };
}
