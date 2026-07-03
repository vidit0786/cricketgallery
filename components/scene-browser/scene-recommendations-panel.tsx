"use client";

import { BarChart3, CheckCircle2, GitCompare, Loader2, Sparkles, WandSparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { CricketSelections } from "@/lib/cricket-options";
import { sceneToSelections } from "@/services/scene-utils/scene-apply";
import type { SceneRecommendation, SceneRecommendationResult } from "@/types/scene-recommendation";

interface SceneRecommendationsPanelProps {
  result: SceneRecommendationResult | null;
  isLoading: boolean;
  error?: string | null;
  onRefresh: () => void;
  onApply: (selections: Partial<CricketSelections>, sceneId: string, generate?: boolean) => void;
}

function Meter({ value, label }: { value: number; label: string }) {
  return (
    <div aria-label={`${label} ${value}%`}>
      <div className="mb-1 flex justify-between text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
        <span>{label}</span>
        <span className="text-primary">{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function RecommendationCard({ item, onApply }: { item: SceneRecommendation; onApply: (generate?: boolean) => void }) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-white/[0.07]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="inline-flex rounded-full bg-primary/15 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-primary">
            {item.slot}
          </p>
          <h3 className="mt-3 text-xl font-black text-foreground">{item.scene.sceneName}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{item.scene.category} · {item.scene.difficulty} · {item.scene.popularity}</p>
        </div>
        <div className="grid size-16 place-items-center rounded-3xl bg-primary text-xl font-black text-primary-foreground">
          {item.confidence}
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.reason}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Meter value={item.estimatedQuality} label="Quality" />
        <Meter value={item.estimatedIdentityMatch} label="Identity" />
      </div>
      <div className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
        <p><strong className="text-foreground">Camera:</strong> {item.scene.recommendedCamera}</p>
        <p><strong className="text-foreground">Lighting:</strong> {item.scene.recommendedLighting}</p>
        <p><strong className="text-foreground">Style:</strong> {item.scene.recommendedCreativeStrategy}</p>
        <p><strong className="text-foreground">Est. time:</strong> {item.estimatedGenerationTimeSeconds}s</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" variant="outline" onClick={() => onApply(false)}>
          <CheckCircle2 aria-hidden="true" /> Apply Scene
        </Button>
        <Button type="button" onClick={() => onApply(true)}>
          <Sparkles aria-hidden="true" /> Apply & Generate
        </Button>
      </div>
    </article>
  );
}

/** AI scene recommendations shown after upload, before generation. */
export function SceneRecommendationsPanel({ result, isLoading, error, onRefresh, onApply }: SceneRecommendationsPanelProps) {
  return (
    <section className="rounded-[2rem] border border-primary/25 bg-primary/[0.05] p-5" aria-label="AI Scene Recommendations">
      <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-xs font-black uppercase tracking-[0.22em] text-primary">
            <WandSparkles className="size-4" aria-hidden="true" /> AI Scene Recommendations
          </p>
          <h2 className="mt-3 text-2xl font-black text-foreground">Best scenes for this image</h2>
          <p className="mt-1 text-sm text-muted-foreground">Recommendations use image analysis, identity profile, preferences and project history.</p>
        </div>
        <Button type="button" variant="outline" onClick={onRefresh} disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin" aria-hidden="true" /> : <BarChart3 aria-hidden="true" />}
          Analyze Scenes
        </Button>
      </div>

      {isLoading ? (
        <div className="grid min-h-40 place-items-center rounded-3xl border border-white/10 bg-black/20 text-center">
          <div>
            <Loader2 className="mx-auto size-10 animate-spin text-primary" aria-hidden="true" />
            <p className="mt-3 font-bold text-foreground">Matching scene templates...</p>
          </div>
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-destructive/35 bg-destructive/10 p-4 text-sm text-destructive-foreground">{error}</div>
      ) : result ? (
        <div className="grid gap-4">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 text-sm text-muted-foreground">
            <GitCompare className="mb-2 size-5 text-primary" aria-hidden="true" /> {result.learningSummary}
          </div>
          <div className="grid gap-4 xl:grid-cols-2">
            {result.recommendations.map((item) => (
              <RecommendationCard
                key={`${item.slot}-${item.scene.id}`}
                item={item}
                onApply={(generate) => onApply(sceneToSelections(item.scene), item.scene.id, generate)}
              />
            ))}
          </div>
        </div>
      ) : (
        <p className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-center text-sm text-muted-foreground">
          Upload an image to receive AI scene matches.
        </p>
      )}
    </section>
  );
}
