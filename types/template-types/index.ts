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
import type { FaceEnhancementPreset } from "@/types/face-enhancement";
import type { SceneCategory, SceneTag } from "@/types/scene-types";

export const TEMPLATE_SCHEMA_VERSION = "1.0.0";

export type TemplateSortMode =
  | "Newest"
  | "Oldest"
  | "Most Used"
  | "Highest Rated"
  | "Favorites"
  | "Recently Used"
  | "Alphabetical";

export interface TemplateThumbnail {
  accent: string;
  icon: string;
}

export interface TemplateConfiguration {
  format?: CricketFormat;
  team?: CricketTeam;
  role?: PlayerRole;
  pose?: CricketPose;
  stadium?: Stadium;
  cameraStyle?: CameraStyle;
  lightingStyle?: LightingStyle;
  promptPreset?: PromptPreset;
  qualityProfile?: QualityLevel;
  creativeStrategy?: CreativeStrategyName | string;
  faceEnhancementPreset?: FaceEnhancementPreset;
  identitySettings?: string[];
  generationPreferences?: {
    variationCount?: number;
    autoRetry?: boolean;
    retryPolicy?: string;
    aspectRatio?: string;
    targetResolution?: string;
    exportTarget?: string;
  };
  provider?: string;
  promptVersion?: string;
}

export interface ProfessionalTemplate {
  id: string;
  schemaVersion: string;
  templateVersion: string;
  name: string;
  description: string;
  category: SceneCategory | "Custom";
  folder: string;
  sceneId?: string;
  tags: SceneTag[];
  thumbnail: TemplateThumbnail;
  configuration: TemplateConfiguration;
  isFavorite: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  recentlyUsedAt?: string;
  recentlyEditedAt?: string;
  generationCount: number;
  successfulGenerations: number;
  averageQualityScore: number;
  source?: "scene" | "generation" | "import" | "custom";
}

export interface TemplateCollection {
  id: string;
  name: string;
  description: string;
  templateIds: string[];
}

export interface TemplateSearchFilters {
  query?: string;
  category?: ProfessionalTemplate["category"] | "All";
  folder?: string | "All";
  tags?: SceneTag[];
  camera?: CameraStyle | "All";
  lighting?: LightingStyle | "All";
  creativeStrategy?: string | "All";
  sort?: TemplateSortMode;
  favoritesOnly?: boolean;
}

export interface TemplateExportPayload {
  schemaVersion: string;
  exportedAt: string;
  source: "Cricket AI Studio";
  templates: ProfessionalTemplate[];
}
