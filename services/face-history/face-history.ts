import type { FaceHistoryEntry, FaceImprovementAction } from "@/types/face-enhancement";
import type { FaceQualityEvaluation } from "@/types/face-enhancement";
import type { IdentityConsistencyScore } from "@/types/identity-types";

export class FaceHistoryBuilder {
  build({
    projectId,
    generatedImageId,
    faceQuality,
    identity,
    promptVersion,
    provider,
  }: {
    projectId: string;
    generatedImageId?: string | null;
    faceQuality: FaceQualityEvaluation;
    identity: IdentityConsistencyScore;
    promptVersion: string;
    provider: string;
  }): FaceHistoryEntry {
    return {
      projectId,
      generatedImageId,
      faceQualityScore: faceQuality.overallFaceQuality,
      identityScore: identity.identityMatch,
      promptVersion,
      provider,
      generationTimestamp: new Date().toISOString(),
      improvementActions: faceQuality.recommendations.map((recommendation) => recommendation.action as FaceImprovementAction),
    };
  }
}
