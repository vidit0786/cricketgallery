import type { ProfessionalTemplate, TemplateCollection } from "@/types/template-types";

const collectionDefinitions: Array<Omit<TemplateCollection, "templateIds"> & { matcher: (template: ProfessionalTemplate) => boolean }> = [
  { id: "ipl", name: "IPL Collection", description: "High-energy franchise cricket templates.", matcher: (template) => template.category === "IPL" || template.tags.includes("IPL") },
  { id: "world-cup", name: "World Cup Collection", description: "International tournament and trophy scenes.", matcher: (template) => template.tags.includes("World Cup") || template.configuration.format === "World Cup" },
  { id: "training", name: "Training Collection", description: "Nets, drills and practice scenes.", matcher: (template) => template.tags.includes("Training") || template.category === "Training" },
  { id: "broadcast", name: "Broadcast Collection", description: "Realistic match broadcast templates.", matcher: (template) => template.configuration.cameraStyle === "Broadcast Camera" },
  { id: "poster", name: "Poster Collection", description: "Hero poster and campaign templates.", matcher: (template) => template.tags.includes("Poster") },
  { id: "magazine", name: "Magazine Collection", description: "Editorial portrait templates.", matcher: (template) => String(template.configuration.creativeStrategy).includes("Magazine") },
  { id: "celebration", name: "Celebration Collection", description: "Victory and trophy scenes.", matcher: (template) => template.tags.includes("Celebration") },
  { id: "captain", name: "Captain Collection", description: "Leadership and captain portraits.", matcher: (template) => template.tags.includes("Captain") || template.configuration.role === "Captain" },
  { id: "bowling", name: "Bowling Collection", description: "Bowling action templates.", matcher: (template) => template.tags.includes("Bowler") || template.configuration.role === "Bowler" },
  { id: "batting", name: "Batting Collection", description: "Batting hero and shot templates.", matcher: (template) => template.tags.includes("Batsman") || template.configuration.role === "Batsman" },
];

export class TemplateOrganizer {
  buildCollections(templates: ProfessionalTemplate[]): TemplateCollection[] {
    return collectionDefinitions.map(({ matcher, ...collection }) => ({
      ...collection,
      templateIds: templates.filter(matcher).map((template) => template.id),
    }));
  }

  folders(templates: ProfessionalTemplate[]) {
    return Array.from(new Set(templates.map((template) => template.folder))).sort();
  }
}

export const templateOrganizer = new TemplateOrganizer();
