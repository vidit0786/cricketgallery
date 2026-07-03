import type { CricketSelections } from "@/lib/cricket-options";
import type { ProfessionalTemplate } from "@/types/template-types";

export const selectedTemplateStorageKey = "cricket-ai-selected-template";

export function templateToSelections(template: ProfessionalTemplate): CricketSelections {
  return {
    format: template.configuration.format,
    team: template.configuration.team,
    role: template.configuration.role,
    pose: template.configuration.pose,
    stadium: template.configuration.stadium,
    cameraStyle: template.configuration.cameraStyle,
    lightingStyle: template.configuration.lightingStyle,
    promptPreset: template.configuration.promptPreset,
    qualityLevel: template.configuration.qualityProfile,
    creativeStrategy: template.configuration.creativeStrategy,
    officialTeamColors: true,
    aspectRatio: template.configuration.generationPreferences?.aspectRatio as CricketSelections["aspectRatio"],
    targetResolution: template.configuration.generationPreferences?.targetResolution as CricketSelections["targetResolution"],
    exportTarget: template.configuration.generationPreferences?.exportTarget as CricketSelections["exportTarget"],
  };
}

export function storeSelectedTemplate(template: ProfessionalTemplate) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(selectedTemplateStorageKey, JSON.stringify({ templateId: template.id, selections: templateToSelections(template) }));
}

export function consumeSelectedTemplate(): { templateId: string; selections: CricketSelections } | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(selectedTemplateStorageKey);
  if (!raw) return null;
  window.localStorage.removeItem(selectedTemplateStorageKey);
  try {
    return JSON.parse(raw) as { templateId: string; selections: CricketSelections };
  } catch {
    return null;
  }
}
