import { z } from "zod";

import { templateVersioningService } from "@/services/template-versioning/template-versioning";
import { dedupeTemplateId } from "@/services/template-utils/template-id";
import type { ProfessionalTemplate, TemplateExportPayload } from "@/types/template-types";

const templateSchema = z.object({
  id: z.string().min(1),
  schemaVersion: z.string().min(1),
  templateVersion: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  category: z.string(),
  folder: z.string(),
  tags: z.array(z.string()),
  thumbnail: z.object({ accent: z.string(), icon: z.string() }),
  configuration: z.record(z.string(), z.unknown()),
  isFavorite: z.boolean(),
  isPinned: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  generationCount: z.number(),
  successfulGenerations: z.number(),
  averageQualityScore: z.number(),
});

const payloadSchema = z.object({
  schemaVersion: z.string().min(1),
  exportedAt: z.string(),
  source: z.string(),
  templates: z.array(templateSchema),
});

export class TemplateImportService {
  parse(json: string, existingIds: string[] = []) {
    const parsed = payloadSchema.safeParse(JSON.parse(json));
    if (!parsed.success) {
      throw new Error("Invalid template export file.");
    }

    if (!templateVersioningService.isCompatible(parsed.data.schemaVersion)) {
      throw new Error(`Template schema ${parsed.data.schemaVersion} is not compatible with this app version.`);
    }

    const idSet = new Set(existingIds);
    return (parsed.data as TemplateExportPayload).templates.map((template) => {
      const id = dedupeTemplateId(idSet, template.id);
      idSet.add(id);
      return {
        ...template,
        id,
        source: "import",
        updatedAt: new Date().toISOString(),
      } satisfies ProfessionalTemplate;
    });
  }
}

export const templateImportService = new TemplateImportService();
