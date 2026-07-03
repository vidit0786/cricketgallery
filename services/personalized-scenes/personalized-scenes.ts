import type { SceneRecommendation } from "@/types/scene-recommendation";

export class PersonalizedScenesService {
  build(recommendations: SceneRecommendation[]) {
    const sorted = [...recommendations].sort((a, b) => b.confidence - a.confidence);
    return [
      { title: "Recommended For You", sceneIds: sorted.slice(0, 6).map((item) => item.scene.id), reason: "Highest overall confidence for your current image and preferences." },
      { title: "Continue Previous Style", sceneIds: sorted.filter((item) => item.signals.historicalSuccess >= 75).slice(0, 6).map((item) => item.scene.id), reason: "Based on your project history and successful styles." },
      { title: "Similar To Favorites", sceneIds: sorted.filter((item) => item.signals.historicalSuccess >= 85).slice(0, 6).map((item) => item.scene.id), reason: "Matches favorite or recently used scene patterns." },
      { title: "Based On Your History", sceneIds: sorted.filter((item) => item.signals.creativeStrategy >= 75).slice(0, 6).map((item) => item.scene.id), reason: "Uses creative strategies that have worked in your account." },
      { title: "Your Best Results", sceneIds: sorted.filter((item) => item.estimatedQuality >= 85).slice(0, 6).map((item) => item.scene.id), reason: "Predicted to produce the strongest quality for this image." },
    ];
  }
}
