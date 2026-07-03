import { describe, expect, it } from "vitest";

import { IdentityEngine } from "@/services/identity-engine";
import { IdentityScoringService } from "@/services/identity-scoring";
import type { IdentityProfile } from "@/types/identity-types";

const profile: IdentityProfile = {
  sourceImageHash: "abc",
  faceShape: "front-facing facial structure",
  eyeShape: "natural eye shape",
  eyeColor: null,
  eyebrowCharacteristics: "thick eyebrows",
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
  confidence: 88,
};

describe("Identity Engine", () => {
  it("builds identity-aware prompt fragments and scores consistency", () => {
    const fragment = new IdentityEngine().buildPromptFragment(profile);
    const score = new IdentityScoringService().evaluate(profile, {
      identityPreservation: 88,
      realism: 86,
      lighting: 84,
      composition: 82,
      cricketAccuracy: 85,
      photographicQuality: 87,
      overall: 85,
      summary: "good",
      recommendations: [],
    });

    expect(fragment).toContain("IDENTITY ENGINE");
    expect(fragment).toContain("short hair");
    expect(score.consistency.identityMatch).toBeGreaterThan(80);
    expect(score.faceQuality.overall).toBeGreaterThan(70);
  });
});
