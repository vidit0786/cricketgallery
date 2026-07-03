import { Eye, ScanFace, Sparkles } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { IdentityEvaluation } from "@/types/identity-types";

interface IdentityPanelProps {
  evaluation?: IdentityEvaluation;
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
        <span>{label}</span>
        <span className="text-primary">{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function IdentityPanel({ evaluation }: IdentityPanelProps) {
  if (!evaluation) return null;

  const { profile, consistency, faceQuality } = evaluation;

  return (
    <Card className="border-primary/25 bg-primary/[0.06]">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-xs font-black uppercase tracking-[0.22em] text-primary">
              <ScanFace className="size-4" aria-hidden="true" /> Identity Engine
            </p>
            <CardTitle className="mt-3">Identity Match: {consistency.label}</CardTitle>
          </div>
          <div className="grid size-16 place-items-center rounded-3xl bg-primary text-2xl font-black text-primary-foreground">
            {consistency.confidence}
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-5 lg:grid-cols-2">
        <div className="grid gap-3">
          <Metric label="Identity Match" value={consistency.identityMatch} />
          <Metric label="Facial Structure" value={consistency.facialStructure} />
          <Metric label="Hair" value={consistency.hairConsistency} />
          <Metric label="Skin Tone" value={consistency.skinToneConsistency} />
          <Metric label="Expression" value={consistency.expressionConsistency} />
        </div>
        <div className="grid gap-3">
          <Metric label="Eye Quality" value={faceQuality.eyeQuality} />
          <Metric label="Symmetry" value={faceQuality.facialSymmetry} />
          <Metric label="Sharpness" value={faceQuality.sharpness} />
          <Metric label="Skin Detail" value={faceQuality.skinDetail} />
          <Metric label="Face Overall" value={faceQuality.overall} />
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 lg:col-span-2">
          <p className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-primary">
            <Eye className="size-4" aria-hidden="true" /> Identity Profile
          </p>
          <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
            <p><strong className="text-foreground">Face:</strong> {profile.faceShape ?? "Not confidently detected"}</p>
            <p><strong className="text-foreground">Eyes:</strong> {profile.eyeShape ?? "Not confidently detected"}</p>
            <p><strong className="text-foreground">Hair:</strong> {[profile.hairStyle, profile.hairColor].filter(Boolean).join(", ") || "Not confidently detected"}</p>
            <p><strong className="text-foreground">Facial Hair:</strong> {profile.beardOrMoustache ?? "None or not visible"}</p>
            <p><strong className="text-foreground">Skin Tone:</strong> {profile.skinTone ?? "Not confidently detected"}</p>
            <p><strong className="text-foreground">Expression:</strong> {profile.facialExpression ?? "Not confidently detected"}</p>
            <p><strong className="text-foreground">Glasses:</strong> {profile.glasses ?? "None or not visible"}</p>
            <p><strong className="text-foreground">Lighting:</strong> {profile.lightingCharacteristics ?? "Not confidently detected"}</p>
          </div>
        </div>
        {evaluation.improvementSuggestions.length ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 lg:col-span-2">
            <p className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-primary">
              <Sparkles className="size-4" aria-hidden="true" /> Improvement Suggestions
            </p>
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {evaluation.improvementSuggestions.map((suggestion) => <li key={suggestion}>{suggestion}</li>)}
            </ul>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
