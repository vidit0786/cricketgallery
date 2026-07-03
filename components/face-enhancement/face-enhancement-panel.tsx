import { History, Sparkles } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FaceHistoryEntry, FaceQualityEvaluation } from "@/types/face-enhancement";

interface FaceEnhancementPanelProps {
  evaluation?: FaceQualityEvaluation;
  historyEntry?: FaceHistoryEntry;
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

export function FaceEnhancementPanel({ evaluation, historyEntry }: FaceEnhancementPanelProps) {
  if (!evaluation) return null;

  return (
    <Card className="border-primary/25 bg-primary/[0.05]">
      <CardHeader>
        <p className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-xs font-black uppercase tracking-[0.22em] text-primary">
          <Sparkles className="size-4" aria-hidden="true" /> Face Enhancement
        </p>
        <CardTitle className="mt-2">Overall Face Quality: {evaluation.label} · {evaluation.overallFaceQuality}%</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-5 lg:grid-cols-2">
        <div className="grid gap-3">
          <Metric label="Eye Quality" value={evaluation.eyeQuality} />
          <Metric label="Facial Symmetry" value={evaluation.facialSymmetry} />
          <Metric label="Skin Detail" value={evaluation.skinDetail} />
          <Metric label="Hair Quality" value={evaluation.hairQuality} />
        </div>
        <div className="grid gap-3">
          <Metric label="Expression" value={evaluation.expressionQuality} />
          <Metric label="Lighting" value={evaluation.lighting} />
          <Metric label="Sharpness" value={evaluation.sharpness} />
          <Metric label="Identity" value={evaluation.identityConsistency} />
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 lg:col-span-2">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">Feature Consistency</p>
          <p className="mt-2 text-sm text-muted-foreground">{evaluation.consistency.summary}</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {evaluation.consistency.items.map((item) => (
              <div key={item.feature} className="rounded-2xl border border-white/10 bg-black/15 p-3 text-sm">
                <p className="font-bold text-foreground">{item.feature}</p>
                <p className="mt-1 text-muted-foreground">{item.note}</p>
              </div>
            ))}
          </div>
        </div>
        {evaluation.recommendations.length ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 lg:col-span-2">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">Auto Improvement Suggestions</p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {evaluation.recommendations.map((recommendation) => (
                <li key={recommendation.action}>{recommendation.label}: {recommendation.reason}</li>
              ))}
            </ul>
          </div>
        ) : null}
        {historyEntry ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 lg:col-span-2">
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-primary"><History className="size-4" /> Consistency History</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Saved face quality trend point: Face {historyEntry.faceQualityScore}% · Identity {historyEntry.identityScore}% · {new Date(historyEntry.generationTimestamp).toLocaleString()}
            </p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
