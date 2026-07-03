import type { SceneCategory, SceneDifficulty, ScenePopularity, SceneTag } from "@/types/scene-types";

export const SCENE_CATEGORIES: SceneCategory[] = ["IPL", "International", "Test Cricket", "ODI", "T20", "Training"];
export const SCENE_DIFFICULTIES: Array<"All" | SceneDifficulty> = ["All", "Easy", "Intermediate", "Advanced", "Pro"];
export const SCENE_POPULARITIES: Array<"All" | ScenePopularity> = ["All", "Rising", "Popular", "Trending", "Classic"];
export const SCENE_TAGS: SceneTag[] = [
  "Hero",
  "Action",
  "Celebration",
  "Poster",
  "Portrait",
  "Training",
  "Captain",
  "Bowler",
  "Batsman",
  "Wicket Keeper",
  "Night Match",
  "Day Match",
  "Rain",
  "World Cup",
  "IPL",
];
