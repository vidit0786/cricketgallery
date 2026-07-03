import type { CricketSelections } from "@/lib/cricket-options";
import { TEMPLATE_SCHEMA_VERSION, type ProfessionalTemplate, type TemplateConfiguration } from "@/types/template-types";
import type { CricketGenerationResult } from "@/types/ai";
import type { SceneTemplate } from "@/types/scene-types";
import { createTemplateId } from "@/services/template-utils/template-id";

function now() {
  return new Date().toISOString();
}

function configFromSelections(selections: CricketSelections): TemplateConfiguration {
  return {
    format: selections.format,
    team: selections.team,
    role: selections.role,
    pose: selections.pose,
    stadium: selections.stadium,
    cameraStyle: selections.cameraStyle,
    lightingStyle: selections.lightingStyle,
    promptPreset: selections.promptPreset,
    qualityProfile: selections.qualityLevel,
    creativeStrategy: selections.creativeStrategy,
    generationPreferences: {
      aspectRatio: selections.aspectRatio,
      targetResolution: selections.targetResolution,
      exportTarget: selections.exportTarget,
    },
  };
}

export class TemplateBuilder {
  fromScene(scene: SceneTemplate): ProfessionalTemplate {
    const timestamp = now();
    return {
      id: createTemplateId("scene-template"),
      schemaVersion: TEMPLATE_SCHEMA_VERSION,
      templateVersion: "1.0.0",
      name: scene.sceneName,
      description: scene.description,
      category: scene.category,
      folder: scene.category,
      sceneId: scene.id,
      tags: scene.tags,
      thumbnail: scene.thumbnail,
      configuration: {
        format: scene.recommendedFormat,
        team: scene.recommendedJersey,
        role: scene.recommendedFor[0],
        pose: scene.recommendedPose,
        stadium: scene.recommendedStadium,
        cameraStyle: scene.recommendedCamera,
        lightingStyle: scene.recommendedLighting,
        promptPreset: scene.recommendedPromptPreset,
        qualityProfile: scene.recommendedQualityProfile,
        creativeStrategy: scene.recommendedCreativeStrategy,
      },
      isFavorite: false,
      isPinned: false,
      createdAt: timestamp,
      updatedAt: timestamp,
      generationCount: 0,
      successfulGenerations: 0,
      averageQualityScore: 0,
      source: "scene",
    };
  }

  fromGeneration({
    name,
    description,
    selections,
    result,
  }: {
    name: string;
    description: string;
    selections: CricketSelections;
    result: CricketGenerationResult;
  }): ProfessionalTemplate {
    const timestamp = now();
    return {
      id: createTemplateId("generation-template"),
      schemaVersion: TEMPLATE_SCHEMA_VERSION,
      templateVersion: "1.0.0",
      name,
      description,
      category: selections.format === "IPL" ? "IPL" : selections.format === "World Cup" || selections.format === "International" ? "International" : selections.format === "Test" ? "Test Cricket" : selections.format === "ODI" ? "ODI" : selections.format === "T20" ? "T20" : "Custom",
      folder: "Saved From Generations",
      tags: ["Hero"],
      thumbnail: { accent: "from-primary/30 via-accent/20 to-black/20", icon: "⭐" },
      configuration: {
        ...configFromSelections(selections),
        provider: result.generatedImage.provider,
        promptVersion: result.promptVersion,
        faceEnhancementPreset: result.faceQualityEvaluation ? "Balanced Enhancement" : undefined,
        identitySettings: result.identityEvaluation?.profile
          ? [
              result.identityEvaluation.profile.faceShape,
              result.identityEvaluation.profile.hairStyle,
              result.identityEvaluation.profile.beardOrMoustache,
              result.identityEvaluation.profile.skinTone,
            ].filter(Boolean) as string[]
          : [],
      },
      isFavorite: false,
      isPinned: false,
      createdAt: timestamp,
      updatedAt: timestamp,
      generationCount: 1,
      successfulGenerations: 1,
      averageQualityScore: result.qualityScore.overall,
      source: "generation",
    };
  }

  custom(input: Partial<ProfessionalTemplate> & Pick<ProfessionalTemplate, "name" | "description" | "category" | "configuration">): ProfessionalTemplate {
    const timestamp = now();
    return {
      id: input.id ?? createTemplateId("custom-template"),
      schemaVersion: TEMPLATE_SCHEMA_VERSION,
      templateVersion: input.templateVersion ?? "1.0.0",
      name: input.name,
      description: input.description,
      category: input.category,
      folder: input.folder ?? "Custom Templates",
      sceneId: input.sceneId,
      tags: input.tags ?? [],
      thumbnail: input.thumbnail ?? { accent: "from-primary/20 via-accent/20 to-black/20", icon: "🏏" },
      configuration: input.configuration,
      isFavorite: input.isFavorite ?? false,
      isPinned: input.isPinned ?? false,
      createdAt: input.createdAt ?? timestamp,
      updatedAt: timestamp,
      recentlyEditedAt: timestamp,
      generationCount: input.generationCount ?? 0,
      successfulGenerations: input.successfulGenerations ?? 0,
      averageQualityScore: input.averageQualityScore ?? 0,
      source: input.source ?? "custom",
    };
  }
}

export const templateBuilder = new TemplateBuilder();
