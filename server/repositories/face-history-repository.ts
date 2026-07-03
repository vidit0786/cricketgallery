import { Prisma } from "@prisma/client";

import { prisma } from "@/server/database/prisma";
import type { FaceHistoryEntry } from "@/types/face-enhancement";

export async function saveFaceQualityHistory(userId: string, entry: FaceHistoryEntry) {
  return prisma.faceQualityHistory.create({
    data: {
      userId,
      projectId: entry.projectId,
      generatedImageId: entry.generatedImageId,
      faceQualityScore: entry.faceQualityScore,
      identityScore: entry.identityScore,
      promptVersion: entry.promptVersion,
      provider: entry.provider,
      improvementActions: entry.improvementActions as unknown as Prisma.InputJsonValue,
      createdAt: new Date(entry.generationTimestamp),
    },
  });
}

export async function listFaceQualityHistory(userId: string, projectId: string) {
  return prisma.faceQualityHistory.findMany({
    where: { userId, projectId },
    orderBy: { createdAt: "desc" },
    take: 30,
  });
}
