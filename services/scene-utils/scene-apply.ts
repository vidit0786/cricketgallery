import type { CricketSelections } from "@/lib/cricket-options";
import type { SceneTemplate } from "@/types/scene-types";

export const selectedSceneStorageKey = "cricket-ai-selected-scene";

export function sceneToSelections(scene: SceneTemplate): CricketSelections {
  return {
    format: scene.recommendedFormat,
    team: scene.recommendedJersey,
    role: scene.recommendedFor[0],
    pose: scene.recommendedPose,
    stadium: scene.recommendedStadium,
    matchTime: scene.recommendedLighting === "Floodlights" || scene.recommendedLighting === "Night Match" ? "Night Match" : scene.recommendedLighting === "Rain Match" ? "Rain Match" : scene.recommendedLighting === "Golden Hour" || scene.recommendedLighting === "Sunset" ? "Sunset Match" : "Day Match",
    cameraStyle: scene.recommendedCamera,
    lightingStyle: scene.recommendedLighting,
    promptPreset: scene.recommendedPromptPreset,
    qualityLevel: scene.recommendedQualityProfile,
    officialTeamColors: true,
    creativeStrategy: scene.recommendedCreativeStrategy,
  } as CricketSelections;
}

export function storeSelectedScene(scene: SceneTemplate) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(selectedSceneStorageKey, JSON.stringify({ sceneId: scene.id, selections: sceneToSelections(scene) }));
}

export function consumeSelectedScene(): { sceneId: string; selections: CricketSelections } | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(selectedSceneStorageKey);
  if (!raw) return null;
  window.localStorage.removeItem(selectedSceneStorageKey);
  try {
    return JSON.parse(raw) as { sceneId: string; selections: CricketSelections };
  } catch {
    return null;
  }
}
