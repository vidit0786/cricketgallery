import type { CreativeGenerationVersion } from "@/types/creative-director";
import type { QualityReport } from "@/types/self-healing";

function clamp(value: number) {
  return Math.max(1, Math.min(99, Math.round(value)));
}

function average(values: number[]) {
  return clamp(values.reduce((sum, value) => sum + value, 0) / values.length);
}

export class QualityInspector {
  inspect(version: CreativeGenerationVersion): QualityReport {
    const scores = version.scores;
    const face = version.feedback.qualityPrediction;
    const prompt = version.prompt.toLowerCase();

    const identityConsistency = clamp(scores.identityPreservation);
    const faceQuality = clamp((scores.facialQuality + face.identityPreservation) / 2);
    const lighting = clamp(scores.lighting);
    const composition = clamp(scores.composition);
    const cricketAccuracy = clamp(scores.cricketAccuracy);
    const poseAccuracy = clamp(scores.cricketAccuracy + (prompt.includes("biomechanics") ? 4 : -3));
    const equipmentAccuracy = clamp(scores.cricketAccuracy + (prompt.includes("bat") && prompt.includes("gloves") ? 4 : -4));
    const cameraQuality = clamp(scores.composition + (prompt.includes("camera") ? 3 : -2));
    const realism = clamp(scores.overallRealism);
    const sharpness = clamp(scores.facialQuality + (prompt.includes("sharp") ? 4 : -4));
    const background = clamp(scores.backgroundQuality);
    const crowd = clamp(scores.backgroundQuality + (prompt.includes("crowd") ? 3 : -5));
    const overallProfessionalQuality = average([
      identityConsistency,
      faceQuality,
      lighting,
      composition,
      cricketAccuracy,
      poseAccuracy,
      equipmentAccuracy,
      cameraQuality,
      realism,
      sharpness,
      background,
      crowd,
    ]);

    return {
      versionId: version.id,
      identityConsistency,
      faceQuality,
      lighting,
      composition,
      cricketAccuracy,
      poseAccuracy,
      equipmentAccuracy,
      cameraQuality,
      realism,
      sharpness,
      background,
      crowd,
      overallProfessionalQuality,
      summary:
        overallProfessionalQuality >= 90
          ? "Professional-quality generation with strong balance across identity, cricket realism and photography."
          : overallProfessionalQuality >= 78
            ? "Good generation with a few targeted improvements available."
            : "Generation may benefit from self-healing prompt correction and retry.",
    };
  }

  inspectMany(versions: CreativeGenerationVersion[]) {
    return versions.map((version) => this.inspect(version));
  }
}
