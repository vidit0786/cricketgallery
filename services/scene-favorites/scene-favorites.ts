const storageKey = "cricket-ai-scene-preferences";

export interface ScenePreferences {
  favorites: string[];
  recentlyUsed: string[];
  recentlyViewed: string[];
  pinned: string[];
}

const initialPreferences: ScenePreferences = {
  favorites: [],
  recentlyUsed: [],
  recentlyViewed: [],
  pinned: [],
};

function uniqueLimit(values: string[], limit = 20) {
  return Array.from(new Set(values)).slice(0, limit);
}

export class SceneFavoritesStore {
  read(): ScenePreferences {
    if (typeof window === "undefined") return initialPreferences;
    try {
      return { ...initialPreferences, ...JSON.parse(window.localStorage.getItem(storageKey) ?? "{}") };
    } catch {
      return initialPreferences;
    }
  }

  write(preferences: ScenePreferences) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(storageKey, JSON.stringify(preferences));
  }

  toggle(sceneId: string, key: keyof Pick<ScenePreferences, "favorites" | "pinned">) {
    const current = this.read();
    const set = new Set(current[key]);
    if (set.has(sceneId)) set.delete(sceneId);
    else set.add(sceneId);
    const next = { ...current, [key]: Array.from(set) };
    this.write(next);
    return next;
  }

  markViewed(sceneId: string) {
    const current = this.read();
    const next = { ...current, recentlyViewed: uniqueLimit([sceneId, ...current.recentlyViewed]) };
    this.write(next);
    return next;
  }

  markUsed(sceneId: string) {
    const current = this.read();
    const next = { ...current, recentlyUsed: uniqueLimit([sceneId, ...current.recentlyUsed]) };
    this.write(next);
    return next;
  }
}

export const sceneFavoritesStore = new SceneFavoritesStore();
