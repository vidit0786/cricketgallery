import type { ProfessionalTemplate } from "@/types/template-types";
import { templateBuilder } from "@/services/template-builder/template-builder";
import { sceneLibrary } from "@/services/scene-library/scene-library";

const storageKey = "cricket-ai-professional-templates";

function readLocal(): ProfessionalTemplate[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(storageKey) ?? "[]") as ProfessionalTemplate[];
  } catch {
    return [];
  }
}

function writeLocal(templates: ProfessionalTemplate[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKey, JSON.stringify(templates));
}

export class TemplateLibrary {
  getBaseTemplates() {
    return sceneLibrary.getAll().map((scene) => templateBuilder.fromScene(scene));
  }

  getUserTemplates() {
    return readLocal();
  }

  getAll() {
    return [...this.getUserTemplates(), ...this.getBaseTemplates()];
  }

  save(template: ProfessionalTemplate) {
    const current = readLocal();
    const next = [template, ...current.filter((item) => item.id !== template.id)];
    writeLocal(next);
    return template;
  }

  update(template: ProfessionalTemplate) {
    return this.save({ ...template, updatedAt: new Date().toISOString(), recentlyEditedAt: new Date().toISOString() });
  }

  remove(templateId: string) {
    const next = readLocal().filter((template) => template.id !== templateId);
    writeLocal(next);
  }

  duplicate(template: ProfessionalTemplate) {
    const copy: ProfessionalTemplate = {
      ...template,
      id: `${template.id}-copy-${Date.now()}`,
      name: `${template.name} Copy`,
      isFavorite: false,
      isPinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      recentlyEditedAt: new Date().toISOString(),
      source: "custom",
    };
    return this.save(copy);
  }

  markUsed(templateId: string) {
    const current = readLocal();
    const next = current.map((template) =>
      template.id === templateId
        ? { ...template, recentlyUsedAt: new Date().toISOString(), generationCount: template.generationCount + 1 }
        : template,
    );
    writeLocal(next);
  }
}

export const templateLibrary = new TemplateLibrary();
