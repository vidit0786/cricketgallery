import { FeatureConsistencyService } from "@/services/feature-consistency/feature-consistency";
import type { ImageQualityScore } from "@/types/ai";
import type { FaceQualityEvaluation, FaceImprovementRecommendation } from "@/types/face-enhancement";
import type { IdentityConsistencyScore, IdentityProfile } from "@/types/identity-types";

function clamp(value: number) {
  return Math.max(1, Math.min(99, Math.round(value)));
}

function labelFor(score: number): FaceQualityEvaluation["label"] {
  if (score >= 90) return "Excellent";
  if (score >= 78) return "Good";
  if (score >= 62) return "Fair";
  return "Needs Improvement";
}

export class FaceQualityEvaluator {
  constructor(private readonly consistencyService = new FeatureConsistencyService()) {}

  evaluate(profile: IdentityProfile, identity: IdentityConsistencyScore, quality: ImageQualityScore): FaceQualityEvaluation {
    const eyeQuality = clamp(identity.identityMatch + (profile.eyeShape ? 4 : -8));
    const facialSymmetry = clamp(identity.facialStructure + (profile.faceShape ? 2 : -5));
    const skinDetail = clamp(identity.skinToneConsistency + (profile.skinTone ? 4 : -5));
    const hairQuality = clamp(identity.hairConsistency + (profile.hairStyle ? 4 : -4));
    const expressionQuality = clamp(identity.expressionConsistency + (profile.facialExpression ? 3 : -5));
    const lighting = clamp(quality.lighting + (profile.lightingCharacteristics ? 3 : -3));
    const sharpness = clamp(quality.photographicQuality + (profile.cameraAngle ? 2 : -3));
    const identityConsistency = identity.identityMatch;
    const overallFaceQuality = clamp((eyeQuality + facialSymmetry + skinDetail + hairQuality + expressionQuality + lighting + sharpness + identityConsistency) / 8);

    const recommendations: FaceImprovementRecommendation[] = [
      eyeQuality < 85 ? { action: "improve_eyes", label: "Improve Eyes", reason: "Eye clarity or shape consistency may need improvement.", expectedGain: 6 } : null,
      hairQuality < 85 ? { action: "improve_hair", label: "Improve Hair", reason: "Hair style or hair detail may drift from the identity profile.", expectedGain: 4 } : null,
      profile.beardOrMoustache && identity.hairConsistency < 88 ? { action: "improve_beard", label: "Improve Beard", reason: "Facial hair should be preserved more consistently.", expectedGain: 4 } : null,
      skinDetail < 85 ? { action: "improve_skin", label: "Improve Skin", reason: "Skin texture should look natural and less plastic.", expectedGain: 5 } : null,
      lighting < 85 ? { action: "improve_lighting", label: "Improve Lighting", reason: "Facial lighting can be more natural and consistent with the source.", expectedGain: 5 } : null,
      sharpness < 85 ? { action: "improve_face_sharpness", label: "Improve Face Sharpness", reason: "Face sharpness can be increased while keeping realism.", expectedGain: 5 } : null,
      quality.realism < 85 ? { action: "improve_realism", label: "Improve Realism", reason: "Overall face realism can be improved.", expectedGain: 6 } : null,
      identity.identityMatch < 80 ? { action: "reduce_face_distortion", label: "Reduce Face Distortion", reason: "Identity match is below target and may need stricter face constraints.", expectedGain: 7 } : null,
      identity.identityMatch < 88 ? { action: "improve_identity_consistency", label: "Improve Identity Consistency", reason: "More identity anchors should be emphasized in the next generation.", expectedGain: 6 } : null,
    ].filter(Boolean) as FaceImprovementRecommendation[];

    return {
      eyeQuality,
      facialSymmetry,
      skinDetail,
      hairQuality,
      expressionQuality,
      lighting,
      sharpness,
      identityConsistency,
      overallFaceQuality,
      label: labelFor(overallFaceQuality),
      recommendations,
      consistency: this.consistencyService.evaluate(profile),
    };
  }
}
