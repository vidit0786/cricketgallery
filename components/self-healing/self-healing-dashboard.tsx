import { Activity, BrainCircuit, GitBranch, TrendingUp, WandSparkles } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SelfHealingResult } from "@/types/self-healing";

interface SelfHealingDashboardProps {
  result?: SelfHealingResult;
}

function Bar({ label, value }: { label: string; value: number }) {
  return (
    <div>
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

export function SelfHealingDashboard({ result }: SelfHealingDashboardProps) {
  if (!result) return null;

  const finalReport = result.reports.find((report) => report.versionId === result.finalRecommendedVersionId) ?? result.reports[0];

  return (
    <Card className="border-primary/25 bg-primary/[0.05]">
      <CardHeader>
        <p className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-xs font-black uppercase tracking-[0.22em] text-primary">
          <BrainCircuit className="size-4" aria-hidden="true" /> Self-Healing AI
        </p>
        <CardTitle className="mt-2">Final Recommendation</CardTitle>
        <p className="text-sm leading-6 text-muted-foreground">{result.finalRecommendationReason}</p>
      </CardHeader>
      <CardContent className="grid gap-5 lg:grid-cols-2">
        <div className="grid gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-4">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-primary"><TrendingUp className="size-4" /> Quality Trend</p>
          {result.timeline.map((item) => (
            <div key={item.id} className="rounded-2xl border border-white/10 bg-black/15 p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-foreground">{item.label}</p>
                <p className="text-xs font-bold text-primary">Q {item.quality}% · ID {item.identity}%</p>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{item.promptChanged ? "Improved prompt" : "Original prompt"}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-4">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-primary"><Activity className="size-4" /> Final Scores</p>
          {finalReport ? (
            <>
              <Bar label="Professional Quality" value={finalReport.overallProfessionalQuality} />
              <Bar label="Identity" value={finalReport.identityConsistency} />
              <Bar label="Face" value={finalReport.faceQuality} />
              <Bar label="Lighting" value={finalReport.lighting} />
              <Bar label="Cricket Accuracy" value={finalReport.cricketAccuracy} />
            </>
          ) : null}
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-primary"><WandSparkles className="size-4" /> Applied Improvements</p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {result.attempts.flatMap((attempt) => attempt.retryDecision.corrections.map((correction) => correction.title)).map((title, index) => (
              <li key={`${title}-${index}`}>{title}</li>
            ))}
            {!result.attempts.some((attempt) => attempt.retryDecision.corrections.length) ? <li>No automatic retry corrections were applied.</li> : null}
          </ul>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-primary"><GitBranch className="size-4" /> Learning Insights</p>
          <p className="mt-3 text-sm text-muted-foreground">Best strategies: {result.learning.bestPerformingStrategies.join(", ") || "Not enough data yet."}</p>
          <p className="mt-2 text-sm text-muted-foreground">Common issues: {result.learning.commonIssues.map((issue) => `${issue.type} (${issue.count})`).join(", ") || "None detected."}</p>
        </div>
      </CardContent>
    </Card>
  );
}
