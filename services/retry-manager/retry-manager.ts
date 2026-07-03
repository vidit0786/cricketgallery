import type { DetectedIssue, RetryDecision, SelfHealingControls } from "@/types/self-healing";
import type { QualityReport } from "@/types/self-healing";
import { PromptSelfCorrectionEngine } from "@/services/prompt-self-correction/prompt-self-correction";

export const DEFAULT_SELF_HEALING_CONTROLS: SelfHealingControls = {
  autoRetry: false,
  retryPolicy: "no_retry",
  maximumRetryCount: 1,
  minimumQualityThreshold: 88,
  minimumIdentityThreshold: 84,
  maximumGenerationTimeMs: 180_000,
  preferredOptimizationStrategy: "balanced",
};

function severityWeight(issue: DetectedIssue) {
  if (issue.severity === "critical") return 14;
  if (issue.severity === "high") return 9;
  if (issue.severity === "medium") return 5;
  return 2;
}

export class RetryManager {
  constructor(private readonly correctionEngine = new PromptSelfCorrectionEngine()) {}

  decide({
    controls,
    report,
    issues,
    attemptNumber,
    prompt,
    elapsedMs,
  }: {
    controls: SelfHealingControls;
    report: QualityReport;
    issues: DetectedIssue[];
    attemptNumber: number;
    prompt: string;
    elapsedMs: number;
  }): RetryDecision {
    const corrections = this.correctionEngine.buildCorrections(issues);
    const predictedImprovement = Math.min(35, issues.reduce((sum, issue) => sum + severityWeight(issue), 0));
    const correctedPrompt = this.correctionEngine.apply(prompt, corrections);

    if (!controls.autoRetry || controls.retryPolicy === "no_retry") {
      return { shouldRetry: false, reason: "Auto retry is disabled.", nextAttemptNumber: attemptNumber + 1, predictedImprovement, correctedPrompt, corrections };
    }

    if (elapsedMs >= controls.maximumGenerationTimeMs) {
      return { shouldRetry: false, reason: "Maximum generation time reached.", nextAttemptNumber: attemptNumber + 1, predictedImprovement, correctedPrompt, corrections };
    }

    if (attemptNumber >= controls.maximumRetryCount) {
      return { shouldRetry: false, reason: "Maximum retry count reached.", nextAttemptNumber: attemptNumber + 1, predictedImprovement, correctedPrompt, corrections };
    }

    if (predictedImprovement < 5) {
      return { shouldRetry: false, reason: "Predicted improvement is too small to justify another generation.", nextAttemptNumber: attemptNumber + 1, predictedImprovement, correctedPrompt, corrections };
    }

    const belowQuality = report.overallProfessionalQuality < controls.minimumQualityThreshold;
    const belowIdentity = report.identityConsistency < controls.minimumIdentityThreshold;

    const shouldRetry =
      controls.retryPolicy === "retry_once" ||
      controls.retryPolicy === "retry_up_to_3" ||
      (controls.retryPolicy === "retry_until_quality_threshold" && belowQuality) ||
      (controls.retryPolicy === "retry_until_identity_threshold" && belowIdentity) ||
      controls.retryPolicy === "retry_until_user_stops";

    return {
      shouldRetry,
      reason: shouldRetry
        ? `Retry recommended because ${belowQuality ? "quality" : "identity"} is below threshold and predicted improvement is ${predictedImprovement}%.`
        : "Current result meets retry policy thresholds.",
      nextAttemptNumber: attemptNumber + 1,
      predictedImprovement,
      correctedPrompt,
      corrections,
    };
  }
}
