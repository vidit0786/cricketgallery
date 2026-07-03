import type { SceneTemplate } from "@/types/scene-types";
import type { SceneMatchSignals } from "@/types/scene-recommendation";

function bestSignal(signals: SceneMatchSignals) {
  return Object.entries(signals).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "sceneCompatibility";
}

export class SceneRecommendationExplainer {
  explain(scene: SceneTemplate, signals: SceneMatchSignals) {
    const strongest = bestSignal(signals);

    const reasonMap: Record<string, string> = {
      poseSimilarity: `We recommend ${scene.sceneName} because your uploaded pose aligns well with ${scene.recommendedPose}.`,
      lightingMatch: `We recommend ${scene.sceneName} because the uploaded lighting can blend naturally with ${scene.recommendedLighting}.`,
      identityCompatibility: `We recommend ${scene.sceneName} because its camera and framing can preserve the uploaded person's visible identity cues well.`,
      sceneCompatibility: `We recommend ${scene.sceneName} because it fits the selected cricket format, role and stadium style.`,
      promptCompatibility: `We recommend ${scene.sceneName} because it maps cleanly to the existing prompt pipeline and quality engine.`,
      creativeStrategy: `We recommend ${scene.sceneName} because its creative strategy (${scene.recommendedCreativeStrategy}) is a strong match for this image.`,
      historicalSuccess: `We recommend ${scene.sceneName} because similar scenes or styles have performed well in this project history.`,
    };

    return reasonMap[strongest] ?? reasonMap.sceneCompatibility;
  }
}
