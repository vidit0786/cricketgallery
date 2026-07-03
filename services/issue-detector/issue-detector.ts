import type { DetectedIssue, IssueSeverity, QualityIssueType, QualityReport } from "@/types/self-healing";

function severity(score: number): IssueSeverity {
  if (score < 55) return "critical";
  if (score < 68) return "high";
  if (score < 80) return "medium";
  return "low";
}

function issue(type: QualityIssueType, score: number, suggestedFix: string): DetectedIssue | null {
  if (score >= 84) return null;
  return {
    type,
    severity: severity(score),
    confidence: Math.max(45, Math.min(96, 100 - score + 30)),
    suggestedFix,
  };
}

export class IssueDetector {
  detect(report: QualityReport): DetectedIssue[] {
    return [
      issue("low_identity_match", report.identityConsistency, "Increase identity preservation emphasis and reuse identity profile anchors."),
      issue("face_distortion", report.faceQuality, "Strengthen facial proportions, symmetry, and natural facial anatomy constraints."),
      issue("blurry_eyes", report.sharpness, "Request sharper eyes, clean catchlights, and crisp face detail."),
      issue("plastic_skin", report.realism, "Emphasize natural skin texture, pores, and realistic sports photography."),
      issue("poor_lighting", report.lighting, "Improve natural shadows, stadium lights, highlights, and exposure balance."),
      issue("incorrect_cricket_bat", report.equipmentAccuracy, "Reinforce correct cricket bat, ball, gloves, pads and helmet details."),
      issue("incorrect_gloves", report.equipmentAccuracy, "Specify anatomically correct batting or wicket-keeping gloves."),
      issue("missing_pads", report.equipmentAccuracy, "Specify correct cricket pads and trousers for the selected role."),
      issue("unnatural_pose", report.poseAccuracy, "Improve cricket biomechanics, action posture, hand placement and balance."),
      issue("poor_background", report.background, "Improve stadium realism, pitch scale, grass texture and environmental depth."),
      issue("crowd_artifacts", report.crowd, "Request realistic crowd depth without duplicate faces or noisy artifacts."),
      issue("incorrect_shadows", report.lighting, "Correct physically plausible shadows and direction of light."),
      issue("wrong_perspective", report.cameraQuality, "Improve camera perspective, lens compression and subject scale."),
      issue("bad_anatomy", Math.min(report.poseAccuracy, report.equipmentAccuracy), "Reinforce natural anatomy, correct limbs and realistic equipment interaction."),
      issue("duplicate_limbs", Math.min(report.poseAccuracy, report.faceQuality), "Explicitly prevent duplicate limbs and malformed body parts."),
    ].filter(Boolean) as DetectedIssue[];
  }
}
