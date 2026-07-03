import type { CreativeGenerationVersion } from "@/types/creative-director";
import type { HealingAttempt, SelfHealingTimelineItem } from "@/types/self-healing";

export class SelfHealingTimelineEngine {
  build(versions: CreativeGenerationVersion[], attempts: HealingAttempt[]): SelfHealingTimelineItem[] {
    const versionItems = versions.map((version, index) => ({
      id: version.id,
      label: `Generation ${index + 1}`,
      versionId: version.id,
      attemptNumber: 1,
      quality: version.scores.overall,
      identity: version.scores.identityPreservation,
      promptChanged: false,
      createdAt: version.generatedAt,
    }));

    const attemptItems = attempts
      .filter((attempt) => attempt.generatedVersion)
      .map((attempt) => ({
        id: attempt.id,
        label: `Improved Prompt → Generation ${attempt.attemptNumber}`,
        versionId: attempt.generatedVersion!.id,
        attemptNumber: attempt.attemptNumber,
        quality: attempt.generatedVersion!.scores.overall,
        identity: attempt.generatedVersion!.scores.identityPreservation,
        promptChanged: true,
        createdAt: attempt.createdAt,
      }));

    return [...versionItems, ...attemptItems].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }
}
