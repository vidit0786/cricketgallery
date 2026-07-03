import type { ImageAnalysis, UploadedImageInput } from "@/types/ai";
import type { IdentityProfile } from "@/types/identity-types";
import { createIdentityHash } from "@/services/identity-utils/identity-cache";

function inferFaceShape(faceAngle: string | null, bodyOrientation: string | null) {
  if (!faceAngle && !bodyOrientation) return null;
  if (`${faceAngle ?? ""} ${bodyOrientation ?? ""}`.toLowerCase().includes("side")) return "side-profile visible facial outline";
  if (`${faceAngle ?? ""}`.toLowerCase().includes("front")) return "front-facing facial structure";
  return "partially visible facial structure";
}

function inferEyeShape(faceDetected: boolean, expression: string | null) {
  if (!faceDetected) return null;
  if (expression?.toLowerCase().includes("smile")) return "naturally narrowed smiling eyes if visible";
  return "visible natural eye shape if clear in source";
}

function confidenceFromAnalysis(analysis: ImageAnalysis) {
  const signals = [
    analysis.face.detected,
    analysis.face.angle,
    analysis.face.expression,
    analysis.hairStyle,
    analysis.hairColor,
    analysis.beardOrMoustache,
    analysis.skinTone,
    analysis.cameraAngle,
    analysis.lighting,
  ].filter(Boolean).length;

  return Math.max(45, Math.min(96, Math.round(48 + signals * 5.5)));
}

export class IdentityProfileBuilder {
  build(image: UploadedImageInput, analysis: ImageAnalysis): IdentityProfile {
    const sourceImageHash = createIdentityHash(image);

    return {
      sourceImageHash,
      faceShape: inferFaceShape(analysis.face.angle, analysis.bodyOrientation),
      eyeShape: inferEyeShape(analysis.face.detected, analysis.face.expression),
      eyeColor: null,
      eyebrowCharacteristics: analysis.face.detected ? "preserve visible eyebrow thickness, spacing and natural shape when discernible" : null,
      noseShape: analysis.face.detected ? "preserve visible nose bridge, tip and proportions from source" : null,
      lips: analysis.face.detected ? "preserve visible lip shape and expression from source" : null,
      jawline: analysis.face.detected ? "preserve visible jawline and chin proportions from source" : null,
      hairStyle: analysis.hairStyle,
      hairColor: analysis.hairColor,
      beardOrMoustache: analysis.beardOrMoustache,
      skinTone: analysis.skinTone,
      facialExpression: analysis.face.expression,
      glasses: analysis.glasses,
      headAngle: analysis.headDirection ?? analysis.face.angle,
      cameraAngle: analysis.cameraAngle,
      lightingCharacteristics: analysis.lighting,
      confidence: confidenceFromAnalysis(analysis),
      createdAt: new Date().toISOString(),
    };
  }
}
