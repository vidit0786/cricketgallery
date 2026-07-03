import type { ImageQualityScore } from "@/types/ai";
import type { FaceQualityScore, IdentityConsistencyScore, IdentityEvaluation, IdentityProfile } from "@/types/identity-types";

function clamp(value: number) {
  return Math.max(1, Math.min(99, Math.round(value)));
}

function labelFor(score: number): IdentityConsistencyScore["label"] {
  if (score >= 90) return "Excellent";
  if (score >= 78) return "Good";
  if (score >= 62) return "Fair";
  return "Needs Improvement";
}

export class IdentityScoringService {
  scoreConsistency(profile: IdentityProfile, qualityScore: ImageQualityScore): IdentityConsistencyScore {
    const profileSignals = [
      profile.faceShape,
      profile.eyeShape,
      profile.noseShape,
      profile.lips,
      profile.jawline,
      profile.hairStyle,
      profile.hairColor,
      profile.beardOrMoustache,
      profile.skinTone,
      profile.facialExpression,
    ].filter(Boolean).length;

    const identityMatch = clamp((qualityScore.identityPreservation ?? 70) * 0.65 + profile.confidence * 0.25 + profileSignals * 1.5);
    const facialStructure = clamp(identityMatch + (profile.faceShape ? 3 : -4));
    const hairConsistency = clamp(identityMatch + (profile.hairStyle || profile.hairColor ? 4 : -3));
    const skinToneConsistency = clamp(identityMatch + (profile.skinTone ? 4 : -3));
    const expressionConsistency = clamp(identityMatch + (profile.facialExpression ? 3 : -2));

    return {
      label: labelFor(identityMatch),
      confidence: identityMatch,
      identityMatch,
      facialStructure,
      hairConsistency,
      skinToneConsistency,
      expressionConsistency,
      notes: [
        profile.confidence >= 80 ? "Source image contains strong identity cues." : "Source image has limited identity cues; results may vary.",
        "Score is an estimate based on source analysis and prompt/quality signals, not a guarantee.",
      ],
    };
  }

  scoreFaceQuality(profile: IdentityProfile, consistency: IdentityConsistencyScore): FaceQualityScore {
    const eyeQuality = clamp(consistency.identityMatch + (profile.eyeShape ? 4 : -6));
    const facialSymmetry = clamp(consistency.facialStructure);
    const expressionConsistency = clamp(consistency.expressionConsistency);
    const sharpness = clamp(consistency.identityMatch + (profile.cameraAngle ? 2 : -3));
    const skinDetail = clamp(consistency.skinToneConsistency + (profile.skinTone ? 3 : -4));
    const identityConsistency = consistency.identityMatch;
    const overall = clamp((eyeQuality + facialSymmetry + expressionConsistency + sharpness + skinDetail + identityConsistency) / 6);

    return {
      eyeQuality,
      facialSymmetry,
      expressionConsistency,
      sharpness,
      skinDetail,
      identityConsistency,
      overall,
      recommendations: [
        eyeQuality < 78 ? "Use Improve Face if eyes appear blurry or inconsistent." : null,
        sharpness < 78 ? "Use a clearer source photo or improve face sharpness." : null,
        skinDetail < 78 ? "Improve skin detail to reduce waxy or plastic appearance." : null,
      ].filter(Boolean) as string[],
    };
  }

  evaluate(profile: IdentityProfile, qualityScore: ImageQualityScore): IdentityEvaluation {
    const consistency = this.scoreConsistency(profile, qualityScore);
    const faceQuality = this.scoreFaceQuality(profile, consistency);
    const improvementSuggestions = [
      consistency.identityMatch < 85 ? "Try Improve Face for stronger identity preservation." : null,
      faceQuality.eyeQuality < 85 ? "Improve eye clarity and facial sharpness." : null,
      faceQuality.skinDetail < 85 ? "Improve skin texture and natural lighting." : null,
      consistency.hairConsistency < 85 ? "Preserve hairstyle and facial hair more explicitly." : null,
    ].filter(Boolean) as string[];

    return { profile, consistency, faceQuality, improvementSuggestions };
  }
}
