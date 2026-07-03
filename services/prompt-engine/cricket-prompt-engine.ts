import type { CricketSelections } from "@/lib/cricket-options";
import { runPromptPipeline } from "@/services/prompt-pipeline/prompt-pipeline";
import type { ImageAnalysis, ImageVariationMode } from "@/types/ai";
import type { FaceEnhancementPlan } from "@/types/face-enhancement";
import type { IdentityProfile } from "@/types/identity-types";

/**
 * Backward-compatible entry point used by API routes.
 * Phase 8.2 delegates to the intelligent multi-stage prompt pipeline.
 */
export function buildCricketImagePrompt({
  analysis,
  selections,
  variationMode: _variationMode,
  identityProfile,
  faceEnhancementPlan,
}: {
  analysis: ImageAnalysis;
  selections: CricketSelections;
  variationMode?: ImageVariationMode;
  identityProfile?: IdentityProfile;
  faceEnhancementPlan?: FaceEnhancementPlan;
}) {
  return runPromptPipeline({ analysis, selections, provider: "openai", variationMode: _variationMode, identityProfile, faceEnhancementPlan }).finalPrompt;
}

export function buildCricketImagePromptDetails({
  analysis,
  selections,
  variationMode: _variationMode,
  identityProfile,
  faceEnhancementPlan,
}: {
  analysis: ImageAnalysis;
  selections: CricketSelections;
  variationMode?: ImageVariationMode;
  identityProfile?: IdentityProfile;
  faceEnhancementPlan?: FaceEnhancementPlan;
}) {
  return runPromptPipeline({ analysis, selections, provider: "openai", variationMode: _variationMode, identityProfile, faceEnhancementPlan });
}
