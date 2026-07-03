import { describe, expect, it } from "vitest";

import { FaceEnhancementEngine } from "@/services/face-enhancement-engine";
import { FaceQualityEvaluator } from "@/services/face-quality-evaluator";
import { IdentityScoringService } from "@/services/identity-scoring";
import type { IdentityProfile } from "@/types/identity-types";

const profile: IdentityProfile = {
  sourceImageHash: "hash",
  faceShape: "front-facing facial structure",
  eyeShape: "natural eyes",
  eyeColor: null,
  eyebrowCharacteristics: "balanced eyebrows",
  noseShape: "straight nose",
  lips: "neutral lips",
  jawline: "defined jawline",
  hairStyle: "short hair",
  hairColor: "black",
  beardOrMoustache: "trimmed beard",
  skinTone: "medium brown",
  facialExpression: "confident smile",
  glasses: null,
  headAngle: "front",
  cameraAngle: "eye level",
  lightingCharacteristics: "soft light",
  confidence: 90,
};

const quality = {
  identityPreservation: 88,
  realism: 86,
  lighting: 84,
  composition: 82,
  cricketAccuracy: 85,
  photographicQuality: 87,
  overall: 85,
  summary: "good",
  recommendations: [],
};

describe("Face enhancement", () => {
  it("creates provider-aware enhancement instructions and evaluates face quality", () => {
    const engine = new FaceEnhancementEngine();
    const plan = engine.createPlan({ identityProfile: profile, provider: "openai" });
    const fragment = engine.buildPromptFragment(plan);
    const identity = new IdentityScoringService().scoreConsistency(profile, quality);
    const faceQuality = new FaceQualityEvaluator().evaluate(profile, identity, quality);

    expect(fragment).toContain("FACE ENHANCEMENT ENGINE");
    expect(fragment).toContain("OpenAI face optimization");
    expect(faceQuality.overallFaceQuality).toBeGreaterThan(70);
    expect(faceQuality.consistency.items.length).toBeGreaterThan(5);
  });
});
