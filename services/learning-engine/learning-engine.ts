import type { CreativeGenerationVersion } from "@/types/creative-director";
import type { HealingAttempt, LearningInsight, QualityIssueType } from "@/types/self-healing";

export class LearningEngine {
  summarize({ versions, attempts }: { versions: CreativeGenerationVersion[]; attempts: HealingAttempt[] }): LearningInsight {
    const issueCounts = new Map<QualityIssueType, number>();
    for (const attempt of attempts) {
      for (const issue of attempt.issues) issueCounts.set(issue.type, (issueCounts.get(issue.type) ?? 0) + 1);
    }

    const commonIssues = Array.from(issueCounts.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    const successfulPromptAdjustments = attempts
      .filter((attempt) => attempt.generatedVersion && attempt.retryDecision.predictedImprovement > 0)
      .flatMap((attempt) => attempt.retryDecision.corrections.map((correction) => correction.title))
      .slice(0, 10);

    const bestPerformingStrategies = [...versions]
      .sort((a, b) => b.scores.overall - a.scores.overall)
      .slice(0, 5)
      .map((version) => version.strategy.name);

    const preferredProviders = Array.from(new Set(versions.map((version) => version.generatedImage.provider)));
    const frequentlySelectedCreativeStyles = Array.from(new Set(versions.map((version) => version.strategy.name))).slice(0, 8);

    return {
      commonIssues,
      successfulPromptAdjustments,
      bestPerformingStrategies,
      preferredProviders,
      frequentlySelectedCreativeStyles,
    };
  }
}
