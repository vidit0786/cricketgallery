import type { CricketSelections } from "@/lib/cricket-options";
import type { ImageAnalysis } from "@/types/ai";
import type { IdentityProfile } from "@/types/identity-types";
import type { SceneTemplate } from "@/types/scene-types";

export type SceneRecommendationSlot =
  | "Top Pick"
  | "Runner Up"
  | "Alternative Choice"
  | "Creative Choice"
  | "Trending Choice"
  | "Hidden Gem";

export interface SceneMatchSignals {
  poseSimilarity: number;
  lightingMatch: number;
  identityCompatibility: number;
  sceneCompatibility: number;
  promptCompatibility: number;
  creativeStrategy: number;
  historicalSuccess: number;
}

export interface SceneRecommendation {
  slot: SceneRecommendationSlot;
  scene: SceneTemplate;
  confidence: number;
  reason: string;
  estimatedQuality: number;
  estimatedIdentityMatch: number;
  estimatedGenerationTimeSeconds: number;
  signals: SceneMatchSignals;
}

export interface SceneRecommendationContext {
  imageAnalysis: ImageAnalysis;
  identityProfile?: IdentityProfile | null;
  currentSelections?: CricketSelections;
  favoriteSceneIds: string[];
  recentlyUsedSceneIds: string[];
  successfulCategories: string[];
  successfulLighting: string[];
  successfulCamera: string[];
  preferredCreativeStrategies: string[];
}

export interface SceneRecommendationResult {
  createdAt: string;
  recommendations: SceneRecommendation[];
  smartCollections: Array<{ title: string; sceneIds: string[]; reason: string }>;
  personalizedCollections: Array<{ title: string; sceneIds: string[]; reason: string }>;
  trending: Array<{ title: string; sceneIds: string[] }>;
  learningSummary: string;
}
