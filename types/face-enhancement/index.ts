import type { ImageQualityScore } from "@/types/ai";
import type { IdentityProfile } from "@/types/identity-types";

export type FaceEnhancementPreset =
  | "Natural Portrait"
  | "Professional Athlete"
  | "Broadcast Ready"
  | "Magazine Cover"
  | "Ultra Realistic"
  | "Soft Lighting"
  | "Sharp Detail"
  | "Balanced Enhancement";

export type FaceImprovementAction =
  | "improve_eyes"
  | "improve_hair"
  | "improve_beard"
  | "improve_skin"
  | "improve_lighting"
  | "improve_face_sharpness"
  | "improve_realism"
  | "reduce_face_distortion"
  | "improve_identity_consistency";

export interface FaceEnhancementPlan {
  preset: FaceEnhancementPreset;
  provider: string;
  instructions: string[];
  providerInstructions: string[];
  identityAnchors: string[];
  warnings: string[];
}

export interface FeatureConsistencyItem {
  feature: string;
  expected: string | null;
  status: "stable" | "watch" | "unknown";
  note: string;
}

export interface FeatureConsistencyReport {
  items: FeatureConsistencyItem[];
  summary: string;
}

export interface FaceQualityEvaluation {
  eyeQuality: number;
  facialSymmetry: number;
  skinDetail: number;
  hairQuality: number;
  expressionQuality: number;
  lighting: number;
  sharpness: number;
  identityConsistency: number;
  overallFaceQuality: number;
  label: "Excellent" | "Good" | "Fair" | "Needs Improvement";
  recommendations: FaceImprovementRecommendation[];
  consistency: FeatureConsistencyReport;
}

export interface FaceImprovementRecommendation {
  action: FaceImprovementAction;
  label: string;
  reason: string;
  expectedGain: number;
}

export interface FaceHistoryEntry {
  id?: string;
  projectId: string;
  generatedImageId?: string | null;
  faceQualityScore: number;
  identityScore: number;
  promptVersion: string;
  provider: string;
  generationTimestamp: string;
  improvementActions: FaceImprovementAction[];
}

export interface FaceEnhancementInput {
  identityProfile: IdentityProfile;
  provider: string;
  qualityScore?: ImageQualityScore;
  preset?: FaceEnhancementPreset;
}
