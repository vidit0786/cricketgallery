import { IssueDetector } from "@/services/issue-detector/issue-detector";
import { LearningEngine } from "@/services/learning-engine/learning-engine";
import { QualityInspector } from "@/services/quality-inspector/quality-inspector";
import { ResultSelector } from "@/services/result-selector/result-selector";
import { DEFAULT_SELF_HEALING_CONTROLS, RetryManager } from "@/services/retry-manager/retry-manager";
import { SelfHealingTimelineEngine } from "@/services/generation-timeline/generation-timeline";
import type { CreativeGenerationVersion } from "@/types/creative-director";
import type { HealingAttempt, SelfHealingControls, SelfHealingResult } from "@/types/self-healing";

export class SelfHealingEngine {
  constructor(
    private readonly inspector = new QualityInspector(),
    private readonly issueDetector = new IssueDetector(),
    private readonly retryManager = new RetryManager(),
    private readonly resultSelector = new ResultSelector(),
    private readonly timelineEngine = new SelfHealingTimelineEngine(),
    private readonly learningEngine = new LearningEngine(),
  ) {}

  inspect(versions: CreativeGenerationVersion[]) {
    const reports = this.inspector.inspectMany(versions);
    const issues = Object.fromEntries(reports.map((report) => [report.versionId, this.issueDetector.detect(report)]));
    return { reports, issues };
  }

  decideRetry({
    controls,
    version,
    attemptNumber,
    elapsedMs,
  }: {
    controls: SelfHealingControls;
    version: CreativeGenerationVersion;
    attemptNumber: number;
    elapsedMs: number;
  }): HealingAttempt {
    const report = this.inspector.inspect(version);
    const issues = this.issueDetector.detect(report);
    const retryDecision = this.retryManager.decide({
      controls,
      report,
      issues,
      attemptNumber,
      prompt: version.prompt,
      elapsedMs,
    });

    return {
      id: `healing-${version.id}-${attemptNumber}-${Date.now()}`,
      attemptNumber,
      sourceVersionId: version.id,
      promptBefore: version.prompt,
      promptAfter: retryDecision.correctedPrompt ?? version.prompt,
      issues,
      retryDecision,
      createdAt: new Date().toISOString(),
    };
  }

  finalize({
    versions,
    attempts,
    controls = DEFAULT_SELF_HEALING_CONTROLS,
  }: {
    versions: CreativeGenerationVersion[];
    attempts: HealingAttempt[];
    controls?: SelfHealingControls;
  }): SelfHealingResult {
    const { reports, issues } = this.inspect(versions);
    const selection = this.resultSelector.select(versions);
    const finalRecommendedVersionId = selection.bestOverall;
    const finalReport = reports.find((report) => report.versionId === finalRecommendedVersionId) ?? reports[0];

    return {
      controls,
      reports,
      issues,
      attempts,
      selection,
      timeline: this.timelineEngine.build(versions, attempts),
      learning: this.learningEngine.summarize({ versions, attempts }),
      finalRecommendedVersionId,
      finalRecommendationReason: `Best overall selected with professional quality ${finalReport?.overallProfessionalQuality ?? 0}%. ${selection.explanations.bestOverall}`,
    };
  }
}
