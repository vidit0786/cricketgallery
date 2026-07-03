import type { Metadata } from "next";
import { LayoutTemplate } from "lucide-react";

import { TemplateStudioClient } from "@/components/template-studio/template-studio-client";
import { requirePageUser } from "@/server/auth/page-guard";
import { templateLibrary } from "@/services/template-library/template-library";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Template Studio",
  description: "Create, edit, import and export professional Cricket AI Studio templates.",
};

export default async function TemplatesPage() {
  await requirePageUser();
  const templates = templateLibrary.getBaseTemplates();

  return (
    <section className="w-full px-3 py-6 sm:px-5 lg:px-6">
      <div className="mx-auto mb-8 max-w-5xl text-center">
        <p className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-primary">
          <LayoutTemplate className="size-4" aria-hidden="true" /> Template Studio
        </p>
        <h1 className="mt-5 text-4xl font-black tracking-tight text-foreground sm:text-5xl">
          Build reusable professional cricket templates
        </h1>
        <p className="mt-4 text-base leading-8 text-muted-foreground">
          Create, edit, duplicate, import, export, organize and apply templates without changing any paid marketplace behavior.
        </p>
      </div>
      <TemplateStudioClient initialTemplates={templates} />
    </section>
  );
}
