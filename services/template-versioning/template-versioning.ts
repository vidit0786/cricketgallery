import { TEMPLATE_SCHEMA_VERSION, type ProfessionalTemplate } from "@/types/template-types";

export class TemplateVersioningService {
  createVersion() {
    return "1.0.0";
  }

  bumpPatch(template: ProfessionalTemplate): ProfessionalTemplate {
    const [major = "1", minor = "0", patch = "0"] = template.templateVersion.split(".");
    return {
      ...template,
      templateVersion: `${major}.${minor}.${Number(patch) + 1}`,
      schemaVersion: TEMPLATE_SCHEMA_VERSION,
      updatedAt: new Date().toISOString(),
      recentlyEditedAt: new Date().toISOString(),
    };
  }

  isCompatible(schemaVersion: string) {
    const [major] = schemaVersion.split(".");
    const [currentMajor] = TEMPLATE_SCHEMA_VERSION.split(".");
    return major === currentMajor;
  }
}

export const templateVersioningService = new TemplateVersioningService();
