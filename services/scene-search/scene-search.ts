import type { SceneSearchFilters, SceneTemplate } from "@/types/scene-types";

function includesText(value: string, query: string) {
  return value.toLowerCase().includes(query.toLowerCase());
}

export class SceneSearchService {
  search(scenes: SceneTemplate[], filters: SceneSearchFilters) {
    const query = filters.query?.trim().toLowerCase();

    return scenes.filter((scene) => {
      if (query) {
        const searchable = [scene.sceneName, scene.description, scene.category, scene.recommendedCreativeStrategy, ...scene.tags].join(" ");
        if (!includesText(searchable, query)) return false;
      }

      if (filters.category && filters.category !== "All" && scene.category !== filters.category) return false;
      if (filters.role && filters.role !== "All" && !scene.recommendedFor.includes(filters.role)) return false;
      if (filters.matchType && filters.matchType !== "All" && scene.recommendedFormat !== filters.matchType) return false;
      if (filters.lighting && filters.lighting !== "All" && scene.recommendedLighting !== filters.lighting) return false;
      if (filters.camera && filters.camera !== "All" && scene.recommendedCamera !== filters.camera) return false;
      if (filters.popularity && filters.popularity !== "All" && scene.popularity !== filters.popularity) return false;
      if (filters.difficulty && filters.difficulty !== "All" && scene.difficulty !== filters.difficulty) return false;
      if (filters.tags?.length && !filters.tags.every((tag) => scene.tags.includes(tag))) return false;

      return true;
    });
  }
}

export const sceneSearchService = new SceneSearchService();
