import type {
  CameraStyle,
  CricketFormat,
  CricketPose,
  CricketTeam,
  LightingStyle,
  PlayerRole,
  PromptPreset,
  QualityLevel,
  Stadium,
} from "@/lib/cricket-options";
import type { CreativeStrategyName } from "@/types/creative-director";

export type SceneCategory = "IPL" | "International" | "Test Cricket" | "ODI" | "T20" | "Training";
export type SceneDifficulty = "Easy" | "Intermediate" | "Advanced" | "Pro";
export type ScenePopularity = "Rising" | "Popular" | "Trending" | "Classic";

export type SceneTag =
  | "Hero"
  | "Action"
  | "Celebration"
  | "Poster"
  | "Portrait"
  | "Training"
  | "Captain"
  | "Bowler"
  | "Batsman"
  | "Wicket Keeper"
  | "Night Match"
  | "Day Match"
  | "Rain"
  | "World Cup"
  | "IPL";

export interface SceneTemplate {
  id: string;
  sceneName: string;
  description: string;
  category: SceneCategory;
  thumbnail: {
    accent: string;
    icon: string;
  };
  difficulty: SceneDifficulty;
  popularity: ScenePopularity;
  recommendedFor: PlayerRole[];
  tags: SceneTag[];
  recommendedCamera: CameraStyle;
  recommendedLighting: LightingStyle;
  recommendedStadium: Stadium;
  recommendedPose: CricketPose;
  recommendedJersey: CricketTeam;
  recommendedFormat: CricketFormat;
  recommendedPromptPreset: PromptPreset;
  recommendedQualityProfile: QualityLevel;
  recommendedCreativeStrategy: CreativeStrategyName;
}

export interface SceneSearchFilters {
  query?: string;
  category?: SceneCategory | "All";
  role?: PlayerRole | "All";
  matchType?: CricketFormat | "All";
  lighting?: LightingStyle | "All";
  camera?: CameraStyle | "All";
  popularity?: ScenePopularity | "All";
  difficulty?: SceneDifficulty | "All";
  tags?: SceneTag[];
}
