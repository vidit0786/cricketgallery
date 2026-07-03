import type { FeatureConsistencyItem, FeatureConsistencyReport } from "@/types/face-enhancement";
import type { IdentityProfile } from "@/types/identity-types";

const featureMap: Array<[string, keyof IdentityProfile]> = [
  ["Face shape", "faceShape"],
  ["Eyes", "eyeShape"],
  ["Eyebrows", "eyebrowCharacteristics"],
  ["Nose", "noseShape"],
  ["Lips", "lips"],
  ["Jawline", "jawline"],
  ["Hair", "hairStyle"],
  ["Beard", "beardOrMoustache"],
  ["Skin tone", "skinTone"],
  ["Expression", "facialExpression"],
  ["Head orientation", "headAngle"],
];

export class FeatureConsistencyService {
  evaluate(profile: IdentityProfile): FeatureConsistencyReport {
    const items: FeatureConsistencyItem[] = featureMap.map(([feature, key]) => {
      const expected = profile[key];
      return {
        feature,
        expected: typeof expected === "string" ? expected : null,
        status: expected ? "stable" : "unknown",
        note: expected ? `Preserve ${feature.toLowerCase()} as: ${expected}.` : `${feature} was not confidently detected in the source image.`,
      };
    });

    const known = items.filter((item) => item.status === "stable").length;
    return {
      items,
      summary: `${known}/${items.length} facial features have usable consistency anchors.`,
    };
  }
}
