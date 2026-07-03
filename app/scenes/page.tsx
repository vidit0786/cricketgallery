import type { Metadata } from "next";
import { Sparkles } from "lucide-react";

import { SceneLibraryClient } from "@/components/scene-browser/scene-library-client";
import { requirePageUser } from "@/server/auth/page-guard";
import { sceneLibrary } from "@/services/scene-library/scene-library";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Scene Library",
  description: "Professional cricket scene templates for Cricket AI Studio.",
};

export default async function ScenesPage() {
  await requirePageUser();
  const scenes = sceneLibrary.getAll();

  return (
    <section className="w-full px-3 py-6 sm:px-5 lg:px-6">
      <div className="mx-auto mb-8 max-w-5xl text-center">
        <p className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-primary">
          <Sparkles className="size-4" aria-hidden="true" /> Scene Library
        </p>
        <h1 className="mt-5 text-4xl font-black tracking-tight text-foreground sm:text-5xl">
          Start from professional cricket concepts
        </h1>
        <p className="mt-4 text-base leading-8 text-muted-foreground">
          Browse reusable scene templates for IPL, international cricket, Test, ODI, T20 and training workflows.
          Apply a scene to auto-populate camera, lighting, prompt preset, strategy and cricket configuration.
        </p>
      </div>
      <SceneLibraryClient scenes={scenes} />
    </section>
  );
}
