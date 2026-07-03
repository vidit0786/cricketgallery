import type { DetectedIssue, PromptCorrection } from "@/types/self-healing";

const correctionMap: Record<string, Omit<PromptCorrection, "targets">> = {
  face_distortion: {
    title: "Reduce Face Distortion",
    instruction: "Strictly preserve facial proportions, eye alignment, nose, lips, jawline, and natural facial anatomy; avoid warped or melted facial features.",
    reason: "Face quality inspection found potential distortion or weak facial structure.",
  },
  low_identity_match: {
    title: "Increase Identity Preservation",
    instruction: "Increase identity preservation emphasis: keep the same recognizable person, hairstyle, facial hair, skin tone, expression, and face shape from the uploaded image.",
    reason: "Identity score is below the configured threshold.",
  },
  poor_lighting: {
    title: "Improve Lighting",
    instruction: "Improve natural lighting, realistic stadium shadows, balanced exposure, catchlights in eyes, and physically plausible highlights.",
    reason: "Lighting score indicates the scene may look unnatural or poorly exposed.",
  },
  blurry_eyes: {
    title: "Sharpen Eyes",
    instruction: "Make eyes sharp and clear with realistic catchlights; keep face and eyes in crisp focus without over-sharpening skin.",
    reason: "Sharpness and eye quality can be improved.",
  },
  plastic_skin: {
    title: "Improve Natural Skin",
    instruction: "Use natural skin texture with subtle pores and realistic sports lighting; avoid waxy, plastic, airbrushed or overly smooth skin.",
    reason: "Realism score indicates possible artificial skin texture.",
  },
  incorrect_cricket_bat: {
    title: "Correct Cricket Equipment",
    instruction: "Use regulation cricket bat proportions, correct ball scale, realistic pads, gloves, helmet, trousers and cricket shoes.",
    reason: "Cricket equipment accuracy requires stronger constraints.",
  },
  unnatural_pose: {
    title: "Correct Pose Biomechanics",
    instruction: "Use authentic cricket biomechanics, natural hands, correct grip, balanced body posture, and realistic action timing.",
    reason: "Pose accuracy can be improved.",
  },
  poor_background: {
    title: "Improve Stadium Background",
    instruction: "Improve realistic stadium background, pitch scale, grass texture, boundary rope, crowd depth and field placement.",
    reason: "Background quality score suggests weak environmental realism.",
  },
  crowd_artifacts: {
    title: "Reduce Crowd Artifacts",
    instruction: "Render the crowd as realistic background depth, not duplicated faces or noisy artifacts; keep subject cleanly separated.",
    reason: "Crowd/background artifacts were detected by score heuristics.",
  },
  wrong_perspective: {
    title: "Correct Camera Perspective",
    instruction: "Correct camera perspective, lens compression, scale and framing so the athlete fits naturally into the stadium.",
    reason: "Camera quality score can be improved.",
  },
  duplicate_limbs: {
    title: "Prevent Duplicate Limbs",
    instruction: "Prevent extra arms, extra legs, duplicate hands, malformed fingers, and duplicated body parts.",
    reason: "Anatomy-related scores indicate possible limb artifacts.",
  },
};

export class PromptSelfCorrectionEngine {
  buildCorrections(issues: DetectedIssue[]): PromptCorrection[] {
    const corrections = new Map<string, PromptCorrection>();

    for (const issue of issues) {
      const base = correctionMap[issue.type] ?? {
        title: "General Quality Correction",
        instruction: issue.suggestedFix,
        reason: "Quality issue requires targeted prompt correction.",
      };
      const existing = corrections.get(base.title);
      corrections.set(base.title, {
        ...base,
        targets: [...(existing?.targets ?? []), issue.type],
      });
    }

    return Array.from(corrections.values());
  }

  apply(prompt: string, corrections: PromptCorrection[]) {
    if (!corrections.length) return prompt;

    return [
      prompt,
      "SELF-HEALING PROMPT CORRECTIONS:",
      ...corrections.map((correction) => `${correction.title}: ${correction.instruction} Reason: ${correction.reason}`),
    ].join("\n\n");
  }
}
