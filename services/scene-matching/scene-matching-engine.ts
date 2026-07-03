import type { SceneTemplate } from "@/types/scene-types";
import type { SceneMatchSignals, SceneRecommendationContext } from "@/types/scene-recommendation";

function includes(value: string | null | undefined, terms: string[]) {
  const normalized = (value ?? "").toLowerCase();
  return terms.some((term) => normalized.includes(term.toLowerCase()));
}

function scoreBoolean(condition: boolean, high = 88, low = 62) {
  return condition ? high : low;
}

export class SceneMatchingEngine {
  score(scene: SceneTemplate, context: SceneRecommendationContext): SceneMatchSignals {
    const analysis = context.imageAnalysis;
    const identity = context.identityProfile;
    const current = context.currentSelections;

    const poseSimilarity = Math.max(
      scoreBoolean(scene.recommendedPose === current?.pose, 92, 60),
      scoreBoolean(includes(analysis.pose, [scene.recommendedPose, scene.tags.join(" ")]), 86, 58),
      scoreBoolean(scene.tags.includes("Portrait") && analysis.portraitVsFullBody === "portrait", 84, 58),
      scoreBoolean(scene.tags.includes("Action") && Boolean(analysis.runningPose || analysis.walkingPose), 84, 58),
    );

    const lightingMatch = Math.max(
      scoreBoolean(scene.recommendedLighting === current?.lightingStyle, 92, 62),
      scoreBoolean(includes(analysis.lighting, ["low", "night", "dim"]) && ["Floodlights", "Night Match"].includes(scene.recommendedLighting), 88, 60),
      scoreBoolean(includes(analysis.lighting, ["warm", "sunset", "golden"]) && scene.recommendedLighting === "Golden Hour", 88, 60),
    );

    const identityCompatibility = Math.max(
      scoreBoolean(Boolean(identity?.confidence && identity.confidence >= 80), 88, 68),
      scoreBoolean(scene.recommendedCamera === "Close-up Portrait" && analysis.face.detected, 86, 64),
      scoreBoolean(scene.tags.includes("Portrait") && analysis.face.detected, 84, 62),
    );

    const sceneCompatibility = Math.max(
      scoreBoolean(scene.recommendedFormat === current?.format, 90, 65),
      scoreBoolean(scene.recommendedFor.includes(current?.role ?? "Batsman"), 88, 64),
      scoreBoolean(scene.recommendedStadium === current?.stadium, 84, 62),
    );

    const promptCompatibility = Math.max(
      scoreBoolean(scene.recommendedPromptPreset === current?.promptPreset, 90, 70),
      scoreBoolean(scene.recommendedQualityProfile === "Ultra", 86, 72),
    );

    const creativeStrategy = Math.max(
      scoreBoolean(scene.recommendedCreativeStrategy === current?.creativeStrategy, 90, 68),
      scoreBoolean(context.preferredCreativeStrategies.includes(scene.recommendedCreativeStrategy), 88, 65),
    );

    const historicalSuccess = Math.max(
      scoreBoolean(context.favoriteSceneIds.includes(scene.id), 94, 62),
      scoreBoolean(context.recentlyUsedSceneIds.includes(scene.id), 84, 62),
      scoreBoolean(context.successfulLighting.includes(scene.recommendedLighting), 82, 62),
      scoreBoolean(context.successfulCamera.includes(scene.recommendedCamera), 82, 62),
      scoreBoolean(context.successfulCategories.includes(scene.recommendedFormat), 80, 62),
    );

    return {
      poseSimilarity,
      lightingMatch,
      identityCompatibility,
      sceneCompatibility,
      promptCompatibility,
      creativeStrategy,
      historicalSuccess,
    };
  }
}
