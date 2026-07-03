import type { ProfessionalTemplate, TemplateSearchFilters } from "@/types/template-types";

function includes(value: string, query: string) {
  return value.toLowerCase().includes(query.toLowerCase());
}

export class TemplateSearchService {
  search(templates: ProfessionalTemplate[], filters: TemplateSearchFilters) {
    const query = filters.query?.trim();
    let result = templates.filter((template) => {
      if (query) {
        const text = [
          template.name,
          template.description,
          template.category,
          template.folder,
          template.configuration.cameraStyle,
          template.configuration.lightingStyle,
          template.configuration.creativeStrategy,
          template.configuration.promptPreset,
          ...template.tags,
        ].filter(Boolean).join(" ");
        if (!includes(text, query)) return false;
      }

      if (filters.category && filters.category !== "All" && template.category !== filters.category) return false;
      if (filters.folder && filters.folder !== "All" && template.folder !== filters.folder) return false;
      if (filters.camera && filters.camera !== "All" && template.configuration.cameraStyle !== filters.camera) return false;
      if (filters.lighting && filters.lighting !== "All" && template.configuration.lightingStyle !== filters.lighting) return false;
      if (filters.creativeStrategy && filters.creativeStrategy !== "All" && template.configuration.creativeStrategy !== filters.creativeStrategy) return false;
      if (filters.favoritesOnly && !template.isFavorite) return false;
      if (filters.tags?.length && !filters.tags.every((tag) => template.tags.includes(tag))) return false;
      return true;
    });

    switch (filters.sort) {
      case "Oldest":
        result = result.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
        break;
      case "Most Used":
        result = result.sort((a, b) => b.generationCount - a.generationCount);
        break;
      case "Highest Rated":
        result = result.sort((a, b) => b.averageQualityScore - a.averageQualityScore);
        break;
      case "Favorites":
        result = result.sort((a, b) => Number(b.isFavorite) - Number(a.isFavorite));
        break;
      case "Recently Used":
        result = result.sort((a, b) => (b.recentlyUsedAt ?? "").localeCompare(a.recentlyUsedAt ?? ""));
        break;
      case "Alphabetical":
        result = result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "Newest":
      default:
        result = result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }

    return result;
  }
}

export const templateSearchService = new TemplateSearchService();
