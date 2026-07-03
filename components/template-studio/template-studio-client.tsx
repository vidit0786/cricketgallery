"use client";

import { ChangeEvent, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Download, Edit3, Folder, Heart, Import, Pin, Plus, Save, Search, Sparkles, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CAMERA_STYLES, LIGHTING_STYLES, PROMPT_PRESETS, QUALITY_LEVELS, STADIUMS, CRICKET_FORMATS, IPL_TEAMS, PLAYER_ROLES } from "@/lib/cricket-options";
import { templateBuilder } from "@/services/template-builder/template-builder";
import { templateExportService } from "@/services/template-export/template-export";
import { templateImportService } from "@/services/template-import/template-import";
import { templateLibrary } from "@/services/template-library/template-library";
import { templateOrganizer } from "@/services/template-organizer/template-organizer";
import { templateSearchService } from "@/services/template-search/template-search";
import { storeSelectedTemplate } from "@/services/template-utils/template-apply";
import { templateVersioningService } from "@/services/template-versioning/template-versioning";
import { SCENE_CATEGORIES, SCENE_TAGS } from "@/services/scene-categories/scene-categories";
import type { ProfessionalTemplate, TemplateSearchFilters, TemplateSortMode } from "@/types/template-types";
import type { SceneTag } from "@/types/scene-types";

interface TemplateStudioClientProps {
  initialTemplates: ProfessionalTemplate[];
}

type EditableTemplate = Pick<ProfessionalTemplate, "name" | "description" | "category" | "folder" | "tags" | "thumbnail" | "configuration">;

const emptyDraft: EditableTemplate = {
  name: "Custom Cricket Template",
  description: "Describe the professional cricket template.",
  category: "Custom",
  folder: "Custom Templates",
  tags: ["Hero"],
  thumbnail: { accent: "from-primary/30 via-accent/20 to-black/20", icon: "🏏" },
  configuration: {
    format: "IPL",
    team: "RCB",
    role: "Batsman",
    pose: "Cover Drive",
    stadium: "M Chinnaswamy Stadium",
    cameraStyle: "Broadcast Camera",
    lightingStyle: "Floodlights",
    promptPreset: "Epic IPL",
    qualityProfile: "Ultra",
    creativeStrategy: "Sports Broadcast",
    faceEnhancementPreset: "Balanced Enhancement",
    generationPreferences: { variationCount: 4, autoRetry: false, aspectRatio: "16:9", targetResolution: "HD", exportTarget: "YouTube Thumbnail" },
  },
};

function TemplateCard({ template, selected, onSelect, onFavorite, onPin, onDuplicate }: { template: ProfessionalTemplate; selected: boolean; onSelect: () => void; onFavorite: () => void; onPin: () => void; onDuplicate: () => void }) {
  return (
    <article className={`group rounded-[1.6rem] border bg-card/70 shadow-2xl shadow-black/15 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 ${selected ? "border-primary" : "border-white/10 hover:border-primary/35"}`}>
      <button type="button" onClick={onSelect} className={`cricket-grid grid aspect-[4/3] w-full place-items-center rounded-t-[1.6rem] bg-gradient-to-br ${template.thumbnail.accent}`} aria-label={`Preview template ${template.name}`}>
        <span className="text-5xl" aria-hidden="true">{template.thumbnail.icon}</span>
      </button>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-black text-foreground">{template.name}</h3>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-primary">v{template.templateVersion} · {template.category}</p>
          </div>
          <div className="flex gap-1">
            <button type="button" onClick={onFavorite} className="grid size-8 place-items-center rounded-full border border-white/10 text-primary" aria-label="Favorite template"><Heart className={template.isFavorite ? "fill-primary" : undefined} /></button>
            <button type="button" onClick={onPin} className="grid size-8 place-items-center rounded-full border border-white/10 text-primary" aria-label="Pin template"><Pin className={template.isPinned ? "fill-primary" : undefined} /></button>
          </div>
        </div>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">{template.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button type="button" size="sm" variant="outline" onClick={onDuplicate}><Copy /> Duplicate</Button>
          <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted-foreground">Used {template.generationCount}</span>
          <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted-foreground">Avg {template.averageQualityScore}%</span>
        </div>
      </div>
    </article>
  );
}

export function TemplateStudioClient({ initialTemplates }: TemplateStudioClientProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [templates, setTemplates] = useState<ProfessionalTemplate[]>(initialTemplates);
  const [selectedId, setSelectedId] = useState(initialTemplates[0]?.id ?? "");
  const [filters, setFilters] = useState<TemplateSearchFilters>({ category: "All", folder: "All", sort: "Newest", tags: [] });
  const [draft, setDraft] = useState<EditableTemplate>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const folders = useMemo(() => templateOrganizer.folders(templates), [templates]);
  const collections = useMemo(() => templateOrganizer.buildCollections(templates), [templates]);
  const filtered = useMemo(() => templateSearchService.search(templates, filters), [templates, filters]);
  const selected = templates.find((template) => template.id === selectedId) ?? filtered[0] ?? templates[0];

  const persist = (next: ProfessionalTemplate[]) => {
    setTemplates(next);
    for (const template of next.filter((item) => item.source !== "scene")) templateLibrary.save(template);
  };

  const selectTemplate = (template: ProfessionalTemplate) => {
    setSelectedId(template.id);
    setDraft({ name: template.name, description: template.description, category: template.category, folder: template.folder, tags: template.tags, thumbnail: template.thumbnail, configuration: template.configuration });
    setEditingId(template.source === "scene" ? null : template.id);
  };

  const saveDraft = () => {
    const base = editingId ? templates.find((template) => template.id === editingId) : null;
    const template = base
      ? templateVersioningService.bumpPatch({ ...base, ...draft })
      : templateBuilder.custom({ ...draft, source: "custom" });
    const next = [template, ...templates.filter((item) => item.id !== template.id)];
    persist(next);
    setSelectedId(template.id);
    setEditingId(template.id);
    setMessage("Template saved.");
  };

  const duplicate = (template: ProfessionalTemplate) => {
    const copy = templateLibrary.duplicate(template);
    const next = [copy, ...templates];
    setTemplates(next);
    setSelectedId(copy.id);
    setEditingId(copy.id);
    setMessage("Template duplicated. You can edit the copy now.");
  };

  const remove = (template: ProfessionalTemplate) => {
    if (template.source === "scene") return setMessage("Built-in scene templates cannot be deleted. Duplicate it first.");
    templateLibrary.remove(template.id);
    const next = templates.filter((item) => item.id !== template.id);
    setTemplates(next);
    setSelectedId(next[0]?.id ?? "");
    setMessage("Template deleted.");
  };

  const toggleFlag = (template: ProfessionalTemplate, key: "isFavorite" | "isPinned") => {
    const updated = { ...template, [key]: !template[key], updatedAt: new Date().toISOString() };
    const next = templates.map((item) => (item.id === template.id ? updated : item));
    persist(next);
  };

  const applyTemplate = (template: ProfessionalTemplate) => {
    storeSelectedTemplate(template);
    templateLibrary.markUsed(template.id);
    setMessage("Template applied. Redirecting to Studio...");
    window.setTimeout(() => router.push("/upload"), 500);
  };

  const importTemplates = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const imported = templateImportService.parse(await file.text(), templates.map((template) => template.id));
      for (const template of imported) templateLibrary.save(template);
      setTemplates((current) => [...imported, ...current]);
      setMessage(`${imported.length} template${imported.length === 1 ? "" : "s"} imported.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Import failed.");
    } finally {
      event.target.value = "";
    }
  };

  const toggleTag = (tag: SceneTag) => {
    setDraft((current) => ({ ...current, tags: current.tags.includes(tag) ? current.tags.filter((item) => item !== tag) : [...current.tags, tag] }));
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[260px_1fr_390px]">
      <aside className="rounded-[2rem] border border-white/10 bg-card/70 p-4 shadow-2xl shadow-black/15 backdrop-blur-xl xl:sticky xl:top-24 xl:h-[calc(100vh-7rem)] xl:overflow-auto">
        <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-primary">Collections</p>
        <div className="grid gap-2">
          <button type="button" onClick={() => setFilters((current) => ({ ...current, folder: "All", category: "All" }))} className="rounded-2xl px-3 py-2 text-left text-sm font-semibold text-muted-foreground hover:bg-white/[0.06] hover:text-foreground">All Templates</button>
          {collections.map((collection) => (
            <button key={collection.id} type="button" onClick={() => setFilters((current) => ({ ...current, query: collection.name.replace(" Collection", "") }))} className="rounded-2xl px-3 py-2 text-left text-sm font-semibold text-muted-foreground hover:bg-white/[0.06] hover:text-foreground">
              {collection.name} <span className="text-xs text-primary">{collection.templateIds.length}</span>
            </button>
          ))}
        </div>
        <p className="mb-3 mt-6 text-xs font-black uppercase tracking-[0.24em] text-primary">Folders</p>
        <div className="grid gap-1">
          {folders.map((folder) => <button key={folder} onClick={() => setFilters((current) => ({ ...current, folder }))} className="flex items-center gap-2 rounded-2xl px-3 py-2 text-left text-sm text-muted-foreground hover:bg-white/[0.06] hover:text-foreground"><Folder className="size-4 text-primary" />{folder}</button>)}
        </div>
      </aside>

      <main className="min-w-0">
        <div className="sticky top-20 z-10 rounded-[2rem] border border-white/10 bg-background/85 p-4 shadow-2xl shadow-black/10 backdrop-blur-xl">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input value={filters.query ?? ""} onChange={(event) => setFilters((current) => ({ ...current, query: event.target.value }))} placeholder="Search templates by name, scene, tags, strategy..." className="h-12 w-full rounded-2xl border border-input bg-white/[0.04] pl-11 pr-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/25" />
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <select value={filters.category ?? "All"} onChange={(event) => setFilters((current) => ({ ...current, category: event.target.value as TemplateSearchFilters["category"] }))} className="h-10 rounded-2xl border border-input bg-white/[0.04] px-3 text-sm text-foreground"><option>All</option><option>Custom</option>{SCENE_CATEGORIES.map((item) => <option key={item}>{item}</option>)}</select>
            <select value={filters.sort ?? "Newest"} onChange={(event) => setFilters((current) => ({ ...current, sort: event.target.value as TemplateSortMode }))} className="h-10 rounded-2xl border border-input bg-white/[0.04] px-3 text-sm text-foreground"><option>Newest</option><option>Oldest</option><option>Most Used</option><option>Highest Rated</option><option>Favorites</option><option>Recently Used</option><option>Alphabetical</option></select>
            <label className="flex h-10 items-center gap-2 rounded-2xl border border-input bg-white/[0.04] px-3 text-sm text-foreground"><input type="checkbox" checked={Boolean(filters.favoritesOnly)} onChange={(event) => setFilters((current) => ({ ...current, favoritesOnly: event.target.checked }))} />Favorites</label>
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 2xl:grid-cols-3">
          {filtered.map((template) => <TemplateCard key={template.id} template={template} selected={selected?.id === template.id} onSelect={() => selectTemplate(template)} onFavorite={() => toggleFlag(template, "isFavorite")} onPin={() => toggleFlag(template, "isPinned")} onDuplicate={() => duplicate(template)} />)}
        </div>
      </main>

      <aside className="rounded-[2rem] border border-white/10 bg-card/70 p-5 shadow-2xl shadow-black/15 backdrop-blur-xl xl:sticky xl:top-24 xl:h-[calc(100vh-7rem)] xl:overflow-auto">
        <div className="mb-4 flex flex-wrap gap-2">
          <Button type="button" onClick={() => { setDraft(emptyDraft); setEditingId(null); }}><Plus /> New</Button>
          <Button type="button" variant="outline" onClick={saveDraft}><Save /> Save</Button>
          {selected ? <Button type="button" variant="outline" onClick={() => applyTemplate(selected)}><Sparkles /> Apply</Button> : null}
        </div>
        <div className="mb-4 flex flex-wrap gap-2">
          {selected ? <Button type="button" variant="outline" onClick={() => templateExportService.download([selected], `${selected.name}.json`)}><Download /> Export</Button> : null}
          <Button type="button" variant="outline" onClick={() => templateExportService.download(templates.filter((item) => item.source !== "scene"), "cricket-ai-custom-templates.json")}><Download /> Export All</Button>
          <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}><Import /> Import</Button>
          <input ref={fileInputRef} type="file" accept="application/json,.json" onChange={importTemplates} className="hidden" />
          {selected ? <Button type="button" variant="destructive" onClick={() => remove(selected)}><Trash2 /> Delete</Button> : null}
        </div>
        {message ? <p className="mb-4 rounded-2xl border border-primary/25 bg-primary/10 p-3 text-sm text-primary">{message}</p> : null}

        <div className="grid gap-3">
          <label className="grid gap-1 text-sm font-semibold text-foreground">Template Name<input value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} className="h-11 rounded-2xl border border-input bg-white/[0.04] px-3 text-sm text-foreground" /></label>
          <label className="grid gap-1 text-sm font-semibold text-foreground">Description<textarea value={draft.description} rows={3} onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))} className="rounded-2xl border border-input bg-white/[0.04] px-3 py-2 text-sm text-foreground" /></label>
          <div className="grid grid-cols-2 gap-2">
            <label className="grid gap-1 text-sm font-semibold text-foreground">Category<select value={draft.category} onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value as ProfessionalTemplate["category"] }))} className="h-11 rounded-2xl border border-input bg-white/[0.04] px-3 text-sm text-foreground"><option>Custom</option>{SCENE_CATEGORIES.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label className="grid gap-1 text-sm font-semibold text-foreground">Folder<input value={draft.folder} onChange={(event) => setDraft((current) => ({ ...current, folder: event.target.value }))} className="h-11 rounded-2xl border border-input bg-white/[0.04] px-3 text-sm text-foreground" /></label>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <select value={draft.configuration.format ?? "IPL"} onChange={(event) => setDraft((current) => ({ ...current, configuration: { ...current.configuration, format: event.target.value as never } }))} className="h-11 rounded-2xl border border-input bg-white/[0.04] px-3 text-sm text-foreground">{CRICKET_FORMATS.map((item) => <option key={item}>{item}</option>)}</select>
            <select value={draft.configuration.team ?? "RCB"} onChange={(event) => setDraft((current) => ({ ...current, configuration: { ...current.configuration, team: event.target.value as never } }))} className="h-11 rounded-2xl border border-input bg-white/[0.04] px-3 text-sm text-foreground">{IPL_TEAMS.map((item) => <option key={item}>{item}</option>)}</select>
            <select value={draft.configuration.role ?? "Batsman"} onChange={(event) => setDraft((current) => ({ ...current, configuration: { ...current.configuration, role: event.target.value as never } }))} className="h-11 rounded-2xl border border-input bg-white/[0.04] px-3 text-sm text-foreground">{PLAYER_ROLES.map((item) => <option key={item}>{item}</option>)}</select>
            <select value={draft.configuration.cameraStyle ?? "Broadcast Camera"} onChange={(event) => setDraft((current) => ({ ...current, configuration: { ...current.configuration, cameraStyle: event.target.value as never } }))} className="h-11 rounded-2xl border border-input bg-white/[0.04] px-3 text-sm text-foreground">{CAMERA_STYLES.map((item) => <option key={item}>{item}</option>)}</select>
            <select value={draft.configuration.lightingStyle ?? "Floodlights"} onChange={(event) => setDraft((current) => ({ ...current, configuration: { ...current.configuration, lightingStyle: event.target.value as never } }))} className="h-11 rounded-2xl border border-input bg-white/[0.04] px-3 text-sm text-foreground">{LIGHTING_STYLES.map((item) => <option key={item}>{item}</option>)}</select>
            <select value={draft.configuration.stadium ?? "M Chinnaswamy Stadium"} onChange={(event) => setDraft((current) => ({ ...current, configuration: { ...current.configuration, stadium: event.target.value as never } }))} className="h-11 rounded-2xl border border-input bg-white/[0.04] px-3 text-sm text-foreground">{STADIUMS.map((item) => <option key={item}>{item}</option>)}</select>
            <select value={draft.configuration.promptPreset ?? "Epic IPL"} onChange={(event) => setDraft((current) => ({ ...current, configuration: { ...current.configuration, promptPreset: event.target.value as never } }))} className="h-11 rounded-2xl border border-input bg-white/[0.04] px-3 text-sm text-foreground">{PROMPT_PRESETS.map((item) => <option key={item}>{item}</option>)}</select>
            <select value={draft.configuration.qualityProfile ?? "Ultra"} onChange={(event) => setDraft((current) => ({ ...current, configuration: { ...current.configuration, qualityProfile: event.target.value as never } }))} className="h-11 rounded-2xl border border-input bg-white/[0.04] px-3 text-sm text-foreground">{QUALITY_LEVELS.map((item) => <option key={item}>{item}</option>)}</select>
          </div>
          <div className="flex flex-wrap gap-2">
            {SCENE_TAGS.map((tag) => <button key={tag} type="button" onClick={() => toggleTag(tag)} className={`rounded-full border px-3 py-1 text-xs ${draft.tags.includes(tag) ? "border-primary bg-primary text-primary-foreground" : "border-white/10 text-muted-foreground"}`}>{tag}</button>)}
          </div>
          {selected ? <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 text-sm text-muted-foreground"><Edit3 className="mb-2 size-5 text-primary" />Version {selected.templateVersion} · Created {new Date(selected.createdAt).toLocaleDateString()} · Updated {new Date(selected.updatedAt).toLocaleDateString()} · Successful {selected.successfulGenerations}</div> : null}
        </div>
      </aside>
    </div>
  );
}
