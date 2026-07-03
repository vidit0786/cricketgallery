import { TEMPLATE_SCHEMA_VERSION, type ProfessionalTemplate, type TemplateExportPayload } from "@/types/template-types";

export class TemplateExportService {
  createPayload(templates: ProfessionalTemplate[]): TemplateExportPayload {
    return {
      schemaVersion: TEMPLATE_SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      source: "Cricket AI Studio",
      templates,
    };
  }

  download(templates: ProfessionalTemplate[], fileName = "cricket-ai-templates.json") {
    if (typeof window === "undefined") return;
    const payload = this.createPayload(templates);
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }
}

export const templateExportService = new TemplateExportService();
