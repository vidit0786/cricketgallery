"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Heart, Pin, Search, Sparkles, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CAMERA_STYLES, CRICKET_FORMATS, LIGHTING_STYLES, PLAYER_ROLES } from "@/lib/cricket-options";
import { SCENE_CATEGORIES, SCENE_DIFFICULTIES, SCENE_POPULARITIES, SCENE_TAGS } from "@/services/scene-categories/scene-categories";
import { sceneFavoritesStore, type ScenePreferences } from "@/services/scene-favorites/scene-favorites";
import { sceneSearchService } from "@/services/scene-search/scene-search";
import { storeSelectedScene } from "@/services/scene-utils/scene-apply";
import type { SceneCategory, SceneDifficulty, ScenePopularity, SceneSearchFilters, SceneTag, SceneTemplate } from "@/types/scene-types";

interface SceneLibraryClientProps {
  scenes: SceneTemplate[];
}

function SceneCard({ scene, isFavorite, isPinned, onSelect, onFavorite, onPin }: {
  scene: SceneTemplate;
  isFavorite: boolean;
  isPinned: boolean;
  onSelect: () => void;
  onFavorite: () => void;
  onPin: () => void;
}) {
  return (
    <article className="group overflow-hidden rounded-[1.6rem] border border-white/10 bg-card/70 shadow-2xl shadow-black/15 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/35">
      <button type="button" onClick={onSelect} className={`cricket-grid relative grid aspect-[4/3] w-full place-items-center bg-gradient-to-br ${scene.thumbnail.accent}`} aria-label={`Preview ${scene.sceneName}`}>
        <span className="text-5xl drop-shadow-xl" aria-hidden="true">{scene.thumbnail.icon}</span>
        <div className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-white">{scene.category}</div>
        <div className="absolute bottom-3 right-3 rounded-full bg-primary px-3 py-1 text-xs font-black text-primary-foreground">{scene.popularity}</div>
      </button>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-black text-foreground">{scene.sceneName}</h3>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-primary">{scene.difficulty}</p>
          </div>
          <div className="flex gap-1">
            <button type="button" onClick={onFavorite} className="grid size-9 place-items-center rounded-full border border-white/10 text-primary hover:bg-white/[0.06]" aria-label="Favorite scene">
              <Heart className={isFavorite ? "fill-primary" : undefined} aria-hidden="true" />
            </button>
            <button type="button" onClick={onPin} className="grid size-9 place-items-center rounded-full border border-white/10 text-primary hover:bg-white/[0.06]" aria-label="Pin scene">
              <Pin className={isPinned ? "fill-primary" : undefined} aria-hidden="true" />
            </button>
          </div>
        </div>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{scene.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {scene.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-muted-foreground">{tag}</span>
          ))}
        </div>
      </div>
    </article>
  );
}

export function SceneLibraryClient({ scenes }: SceneLibraryClientProps) {
  const router = useRouter();
  const [filters, setFilters] = useState<SceneSearchFilters>({ category: "All", role: "All", matchType: "All", lighting: "All", camera: "All", popularity: "All", difficulty: "All", tags: [] });
  const [selectedScene, setSelectedScene] = useState<SceneTemplate | null>(scenes[0] ?? null);
  const [preferences, setPreferences] = useState<ScenePreferences>(() => sceneFavoritesStore.read());
  const [appliedMessage, setAppliedMessage] = useState<string | null>(null);

  const filteredScenes = useMemo(() => sceneSearchService.search(scenes, filters), [scenes, filters]);

  const selectScene = (scene: SceneTemplate) => {
    setSelectedScene(scene);
    setPreferences(sceneFavoritesStore.markViewed(scene.id));
  };

  const applyScene = (scene: SceneTemplate) => {
    storeSelectedScene(scene);
    setPreferences(sceneFavoritesStore.markUsed(scene.id));
    setAppliedMessage(`${scene.sceneName} applied. Redirecting to Studio...`);
    window.setTimeout(() => router.push("/upload"), 500);
  };

  const toggleTag = (tag: SceneTag) => {
    setFilters((current) => {
      const tags = new Set(current.tags ?? []);
      if (tags.has(tag)) tags.delete(tag);
      else tags.add(tag);
      return { ...current, tags: Array.from(tags) };
    });
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[260px_1fr_380px]">
      <aside className="rounded-[2rem] border border-white/10 bg-card/70 p-4 shadow-2xl shadow-black/15 backdrop-blur-xl xl:sticky xl:top-24 xl:h-[calc(100vh-7rem)] xl:overflow-auto">
        <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-primary">Categories</p>
        <div className="grid gap-2">
          {(["All", ...SCENE_CATEGORIES] as Array<"All" | SceneCategory>).map((category) => (
            <button key={category} type="button" onClick={() => setFilters((current) => ({ ...current, category }))} className={`rounded-2xl px-3 py-2 text-left text-sm font-semibold transition-colors ${filters.category === category ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-white/[0.06] hover:text-foreground"}`}>
              {category}
            </button>
          ))}
        </div>

        <p className="mb-3 mt-6 text-xs font-black uppercase tracking-[0.24em] text-primary">Tags</p>
        <div className="flex flex-wrap gap-2">
          {SCENE_TAGS.map((tag) => (
            <button key={tag} type="button" onClick={() => toggleTag(tag)} className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${(filters.tags ?? []).includes(tag) ? "border-primary bg-primary text-primary-foreground" : "border-white/10 bg-white/[0.04] text-muted-foreground hover:text-foreground"}`}>
              {tag}
            </button>
          ))}
        </div>
      </aside>

      <main className="min-w-0">
        <div className="sticky top-20 z-10 rounded-[2rem] border border-white/10 bg-background/85 p-4 shadow-2xl shadow-black/10 backdrop-blur-xl">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input value={filters.query ?? ""} onChange={(event) => setFilters((current) => ({ ...current, query: event.target.value }))} placeholder="Search scenes by category, role, mood, tags..." className="h-12 w-full rounded-2xl border border-input bg-white/[0.04] pl-11 pr-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/25" aria-label="Search scene library" />
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            <select value={filters.role ?? "All"} onChange={(event) => setFilters((current) => ({ ...current, role: event.target.value as SceneSearchFilters["role"] }))} className="h-10 rounded-2xl border border-input bg-white/[0.04] px-3 text-sm text-foreground" aria-label="Filter by role"><option className="bg-card">All</option>{PLAYER_ROLES.map((item) => <option key={item} className="bg-card">{item}</option>)}</select>
            <select value={filters.matchType ?? "All"} onChange={(event) => setFilters((current) => ({ ...current, matchType: event.target.value as SceneSearchFilters["matchType"] }))} className="h-10 rounded-2xl border border-input bg-white/[0.04] px-3 text-sm text-foreground" aria-label="Filter by match type"><option className="bg-card">All</option>{CRICKET_FORMATS.map((item) => <option key={item} className="bg-card">{item}</option>)}</select>
            <select value={filters.lighting ?? "All"} onChange={(event) => setFilters((current) => ({ ...current, lighting: event.target.value as SceneSearchFilters["lighting"] }))} className="h-10 rounded-2xl border border-input bg-white/[0.04] px-3 text-sm text-foreground" aria-label="Filter by lighting"><option className="bg-card">All</option>{LIGHTING_STYLES.map((item) => <option key={item} className="bg-card">{item}</option>)}</select>
            <select value={filters.camera ?? "All"} onChange={(event) => setFilters((current) => ({ ...current, camera: event.target.value as SceneSearchFilters["camera"] }))} className="h-10 rounded-2xl border border-input bg-white/[0.04] px-3 text-sm text-foreground" aria-label="Filter by camera"><option className="bg-card">All</option>{CAMERA_STYLES.map((item) => <option key={item} className="bg-card">{item}</option>)}</select>
            <select value={filters.popularity ?? "All"} onChange={(event) => setFilters((current) => ({ ...current, popularity: event.target.value as ScenePopularity | "All" }))} className="h-10 rounded-2xl border border-input bg-white/[0.04] px-3 text-sm text-foreground" aria-label="Filter by popularity">{SCENE_POPULARITIES.map((item) => <option key={item} className="bg-card">{item}</option>)}</select>
            <select value={filters.difficulty ?? "All"} onChange={(event) => setFilters((current) => ({ ...current, difficulty: event.target.value as SceneDifficulty | "All" }))} className="h-10 rounded-2xl border border-input bg-white/[0.04] px-3 text-sm text-foreground" aria-label="Filter by difficulty">{SCENE_DIFFICULTIES.map((item) => <option key={item} className="bg-card">{item}</option>)}</select>
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 2xl:grid-cols-3">
          {filteredScenes.map((scene) => (
            <SceneCard
              key={scene.id}
              scene={scene}
              isFavorite={preferences.favorites.includes(scene.id)}
              isPinned={preferences.pinned.includes(scene.id)}
              onSelect={() => selectScene(scene)}
              onFavorite={() => setPreferences(sceneFavoritesStore.toggle(scene.id, "favorites"))}
              onPin={() => setPreferences(sceneFavoritesStore.toggle(scene.id, "pinned"))}
            />
          ))}
        </div>
        {!filteredScenes.length ? <p className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-center text-muted-foreground">No scenes match your filters.</p> : null}
      </main>

      <aside className="rounded-[2rem] border border-white/10 bg-card/70 p-5 shadow-2xl shadow-black/15 backdrop-blur-xl xl:sticky xl:top-24 xl:h-[calc(100vh-7rem)] xl:overflow-auto" aria-label="Scene preview drawer">
        {selectedScene ? (
          <div>
            <div className={`cricket-grid grid aspect-video place-items-center rounded-3xl bg-gradient-to-br ${selectedScene.thumbnail.accent}`}>
              <span className="text-6xl" aria-hidden="true">{selectedScene.thumbnail.icon}</span>
            </div>
            <div className="mt-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">{selectedScene.category}</p>
                <h2 className="mt-2 text-2xl font-black text-foreground">{selectedScene.sceneName}</h2>
              </div>
              <Sparkles className="size-6 text-primary" aria-hidden="true" />
            </div>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">{selectedScene.description}</p>
            <dl className="mt-5 grid gap-3 text-sm">
              {[
                ["Camera", selectedScene.recommendedCamera],
                ["Lighting", selectedScene.recommendedLighting],
                ["Stadium", selectedScene.recommendedStadium],
                ["Pose", selectedScene.recommendedPose],
                ["Jersey", selectedScene.recommendedJersey],
                ["Preset", selectedScene.recommendedPromptPreset],
                ["Strategy", selectedScene.recommendedCreativeStrategy],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2">
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="text-right font-semibold text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-5 flex flex-wrap gap-2">
              {selectedScene.recommendedFor.map((role) => <span key={role} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{role}</span>)}
            </div>
            <Button type="button" size="lg" className="mt-6 w-full" onClick={() => applyScene(selectedScene)}>
              <CheckCircle2 aria-hidden="true" /> Apply Scene
            </Button>
            {appliedMessage ? <p className="mt-3 text-sm text-primary">{appliedMessage}</p> : null}
          </div>
        ) : (
          <div className="grid min-h-80 place-items-center text-center text-muted-foreground">
            <div>
              <X className="mx-auto mb-3 size-8" aria-hidden="true" />
              Select a scene to preview details.
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
