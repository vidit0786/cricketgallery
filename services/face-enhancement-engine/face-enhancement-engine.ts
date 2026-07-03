import { getEnhancementPreset } from "@/services/enhancement-presets/enhancement-presets";
import { ProviderFaceOptimizer } from "@/services/provider-face-optimizer/provider-face-optimizer";
import type { FaceEnhancementInput, FaceEnhancementPlan } from "@/types/face-enhancement";
import type { IdentityProfile } from "@/types/identity-types";

function identityAnchors(profile: IdentityProfile) {
  return [
    profile.faceShape ? `face shape: ${profile.faceShape}` : null,
    profile.eyeShape ? `eye shape: ${profile.eyeShape}` : null,
    profile.eyebrowCharacteristics ? `eyebrows: ${profile.eyebrowCharacteristics}` : null,
    profile.noseShape ? `nose: ${profile.noseShape}` : null,
    profile.lips ? `lips: ${profile.lips}` : null,
    profile.jawline ? `jawline: ${profile.jawline}` : null,
    profile.hairStyle ? `hair style: ${profile.hairStyle}` : null,
    profile.hairColor ? `hair color: ${profile.hairColor}` : null,
    profile.beardOrMoustache ? `facial hair: ${profile.beardOrMoustache}` : null,
    profile.skinTone ? `skin tone: ${profile.skinTone}` : null,
    profile.facialExpression ? `expression: ${profile.facialExpression}` : null,
    profile.glasses ? `glasses: ${profile.glasses}` : null,
    profile.headAngle ? `head angle: ${profile.headAngle}` : null,
  ].filter(Boolean) as string[];
}

export class FaceEnhancementEngine {
  constructor(private readonly providerOptimizer = new ProviderFaceOptimizer()) {}

  createPlan(input: FaceEnhancementInput): FaceEnhancementPlan {
    const preset = getEnhancementPreset(input.preset);
    const anchors = identityAnchors(input.identityProfile);

    return {
      preset: preset.name,
      provider: input.provider,
      instructions: [
        "FACE ENHANCEMENT ENGINE:",
        "Improve facial realism while preserving recognizable identity within provider capabilities.",
        "Preserve facial proportions, hairstyle, facial hair, expression, skin tone and natural lighting.",
        "Improve eye clarity, facial sharpness, skin texture and facial detail without making the face plastic or over-smoothed.",
        ...preset.instructions,
      ],
      providerInstructions: this.providerOptimizer.optimize(input.provider),
      identityAnchors: anchors,
      warnings: [
        "Do not claim perfect identity preservation; maximize consistency only within image model capability.",
        "Avoid changing recognizable face characteristics beyond what the cricket scene requires.",
      ],
    };
  }

  buildPromptFragment(plan: FaceEnhancementPlan) {
    return [
      ...plan.instructions,
      "Identity anchors to preserve:",
      plan.identityAnchors.length ? plan.identityAnchors.join("\n") : "Preserve all visible identity cues from the uploaded image.",
      ...plan.providerInstructions,
      ...plan.warnings,
    ].join("\n");
  }
}
