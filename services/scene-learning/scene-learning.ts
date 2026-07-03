import type { SceneRecommendationContext } from "@/types/scene-recommendation";

interface HistoryImageLike {
  cricketSelections: unknown;
  qualityScore: unknown;
  imageProvider: string;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function collect(values: Array<string | undefined>) {
  return Array.from(new Set(values.filter(Boolean) as string[]));
}

export class SceneLearningEngine {
  fromHistory(images: HistoryImageLike[], favoriteSceneIds: string[] = [], recentlyUsedSceneIds: string[] = []): Pick<
    SceneRecommendationContext,
    "favoriteSceneIds" | "recentlyUsedSceneIds" | "successfulCategories" | "successfulLighting" | "successfulCamera" | "preferredCreativeStrategies"
  > {
    const highQuality = images.filter((image) => Number(asRecord(image.qualityScore).overall ?? 0) >= 82);
    const selections = highQuality.map((image) => asRecord(image.cricketSelections));

    return {
      favoriteSceneIds,
      recentlyUsedSceneIds,
      successfulCategories: collect(selections.map((selection) => selection.format as string | undefined)),
      successfulLighting: collect(selections.map((selection) => selection.lightingStyle as string | undefined)),
      successfulCamera: collect(selections.map((selection) => selection.cameraStyle as string | undefined)),
      preferredCreativeStrategies: collect(selections.map((selection) => selection.creativeStrategy as string | undefined)),
    };
  }

  summarize(context: Pick<SceneRecommendationContext, "favoriteSceneIds" | "recentlyUsedSceneIds" | "successfulLighting" | "successfulCamera" | "preferredCreativeStrategies">) {
    return [
      context.favoriteSceneIds.length ? `${context.favoriteSceneIds.length} favorite scenes considered` : null,
      context.recentlyUsedSceneIds.length ? `${context.recentlyUsedSceneIds.length} recently used scenes considered` : null,
      context.successfulLighting.length ? `Successful lighting: ${context.successfulLighting.join(", ")}` : null,
      context.successfulCamera.length ? `Successful camera: ${context.successfulCamera.join(", ")}` : null,
      context.preferredCreativeStrategies.length ? `Preferred strategies: ${context.preferredCreativeStrategies.join(", ")}` : null,
    ].filter(Boolean).join(". ") || "No project-specific scene learning data yet.";
  }
}
