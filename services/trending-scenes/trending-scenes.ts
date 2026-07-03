import type { SceneTemplate } from "@/types/scene-types";

function byIds(scenes: SceneTemplate[], ids: string[]) {
  const idSet = new Set(ids);
  return scenes.filter((scene) => idSet.has(scene.id)).map((scene) => scene.id);
}

export class TrendingScenesService {
  build(scenes: SceneTemplate[]) {
    return [
      { title: "Most Used", sceneIds: byIds(scenes, ["ipl-batting-hero-shot", "world-cup-final", "net-practice", "winning-six"]) },
      { title: "Highest Rated", sceneIds: byIds(scenes, ["ipl-final-trophy-lift", "world-cup-final", "century-celebration"]) },
      { title: "Most Generated", sceneIds: byIds(scenes, ["ipl-winning-celebration", "super-over", "player-of-the-match"]) },
      { title: "Recently Popular", sceneIds: byIds(scenes, ["fireworks-celebration", "death-overs", "gym-workout"]) },
      { title: "Editor's Choice", sceneIds: byIds(scenes, ["classic-test-match", "international-captain-portrait", "ipl-captain-walk"]) },
      { title: "Seasonal Picks", sceneIds: byIds(scenes, ["world-cup-final", "ipl-final-trophy-lift", "victory-lap"]) },
    ];
  }
}
