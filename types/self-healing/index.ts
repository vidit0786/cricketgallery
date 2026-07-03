import type { CreativeGenerationVersion } from "@/types/creative-director";

export type QualityIssueType =
  | "face_distortion"
  | "low_identity_match"
  | "incorrect_hairstyle"
  | "poor_lighting"
  | "blurry_eyes"
  | "plastic_skin"
  | "incorrect_cricket_bat"
  | "incorrect_gloves"
  | "missing_pads"
  | "unnatural_pose"
  | "poor_background"
  | "bad_anatomy"
  | "crowd_artifacts"
  | "incorrect_shadows"
  | "wrong_perspective"
  | "duplicate_limbs";

export type IssueSeverity = "low" | "medium" | "high" | "critical";

export type RetryPolicy =
  | "no_retry"
  | "retry_once"
  | "retry_up_to_3"
  | "retry_until_quality_threshold"
  | "retry_until_identity_threshold"
  | "retry_until_user_stops";

export type PreferredOptimizationStrategy =
  | "balanced"
  | "identity_first"
  | "realism_first"
  | "lighting_first"
  | "cricket_accuracy_first"
  | "sports_photography_first";

export interface SelfHealingControls {
  autoRetry: boolean;
  retryPolicy: RetryPolicy;
  maximumRetryCount: number;
  minimumQualityThreshold: number;
  minimumIdentityThreshold: number;
  maximumGenerationTimeMs: number;
  preferredOptimizationStrategy: PreferredOptimizationStrategy;
}

export interface QualityReport {
  versionId: string;
  identityConsistency: number;
  faceQuality: number;
  lighting: number;
  composition: number;
  cricketAccuracy: number;
  poseAccuracy: number;
  equipmentAccuracy: number;
  cameraQuality: number;
  realism: number;
  sharpness: number;
  background: number;
  crowd: number;
  overallProfessionalQuality: number;
  summary: string;
}

export interface DetectedIssue {
  type: QualityIssueType;
  severity: IssueSeverity;
  confidence: number;
  suggestedFix: string;
}

export interface PromptCorrection {
  title: string;
  instruction: string;
  reason: string;
  targets: QualityIssueType[];
}

export interface RetryDecision {
  shouldRetry: boolean;
  reason: string;
  nextAttemptNumber: number;
  predictedImprovement: number;
  correctedPrompt?: string;
  corrections: PromptCorrection[];
}

export interface HealingAttempt {
  id: string;
  attemptNumber: number;
  sourceVersionId: string;
  promptBefore: string;
  promptAfter: string;
  issues: DetectedIssue[];
  retryDecision: RetryDecision;
  generatedVersion?: CreativeGenerationVersion;
  createdAt: string;
}

export interface ResultSelection {
  bestOverall: string;
  bestIdentity: string;
  bestRealism: string;
  bestSportsPhotography: string;
  bestLighting: string;
  bestComposition: string;
  bestSocialMediaReady: string;
  explanations: Record<string, string>;
}

export interface SelfHealingTimelineItem {
  id: string;
  label: string;
  versionId: string;
  attemptNumber: number;
  quality: number;
  identity: number;
  promptChanged: boolean;
  createdAt: string;
}

export interface LearningInsight {
  commonIssues: Array<{ type: QualityIssueType; count: number }>;
  successfulPromptAdjustments: string[];
  bestPerformingStrategies: string[];
  preferredProviders: string[];
  frequentlySelectedCreativeStyles: string[];
}

export interface SelfHealingResult {
  controls: SelfHealingControls;
  reports: QualityReport[];
  issues: Record<string, DetectedIssue[]>;
  attempts: HealingAttempt[];
  selection: ResultSelection;
  timeline: SelfHealingTimelineItem[];
  learning: LearningInsight;
  finalRecommendedVersionId: string;
  finalRecommendationReason: string;
}
