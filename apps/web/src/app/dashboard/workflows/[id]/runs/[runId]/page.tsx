"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft, CheckCircle2, XCircle, Clock, Loader2, AlertTriangle,
  ChevronRight, Code2,
} from "lucide-react";

interface StepExecution {
  id: string;
  nodeId: string;
  nodeType: string;
  nodeLabel: string;
  status: string;
  input: unknown;
  output: unknown;
  error: string | null;
  durationMs: number | null;
  startedAt: string | null;
  completedAt: string | null;
}

interface RunDetail {
  id: string;
  status: string;
  startedAt: string | null;
  completedAt: string | null;
  error: string | null;
  triggerData: unknown;
  steps: StepExecution[];
}

const statusIcon: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string }> = {
  SUCCESS: { icon: CheckCircle2, color: "text-emerald-400" },
  FAILED: { icon: XCircle, color: "text-red-400" },
  RUNNING: { icon: Loader2, color: "text-sky-400" },
  PENDING: { icon: Clock, color: "text-zinc-500" },
  SKIPPED: { icon: AlertTriangle, color: "text-amber-400" },
};

export default function RunDetailPage() {
  const params = useParams();
  const [run, setRun] = useState<RunDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/workflows/${params.id}/runs/${params.runId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setRun(d.data);
        setLoading(false);
      });
  }, [params.id, params.runId]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!run) {
    return (
      <div className="p-8 text-center text-destructive">Run not found</div>
    );
  }

  const runStatus = statusIcon[run.status] ?? statusIcon.PENDING;
  const RunStatusIcon = runStatus.icon;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/workflows/${params.id}/runs`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1" /> Runs
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Execution Timeline</h1>
            <RunStatusIcon className={`w-5 h-5 ${runStatus.color}`} />
          </div>
          <p className="text-sm text-muted-foreground font-mono">{run.id}</p>
        </div>
        <Badge
          variant={
            run.status === "COMPLETED" ? "success" :
            run.status === "FAILED" ? "destructive" :
            run.status === "RUNNING" ? "info" : "secondary"
          }
        >
          {run.status}
        </Badge>
      </div>

      {/* Run summary */}
      <Card className="glass">
        <CardContent className="p-4 grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Started</p>
            <p>{run.startedAt ? new Date(run.startedAt).toLocaleString() : "—"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Completed</p>
            <p>{run.completedAt ? new Date(run.completedAt).toLocaleString() : "—"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Total Duration</p>
            <p>
              {run.startedAt && run.completedAt
                ? `${((new Date(run.completedAt).getTime() - new Date(run.startedAt).getTime()) / 1000).toFixed(2)}s`
                : "—"}
            </p>
          </div>
        </CardContent>
      </Card>

      {run.error && (
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="p-4">
            <p className="text-sm text-destructive">{run.error}</p>
          </CardContent>
        </Card>
      )}

      {/* Steps Timeline */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Step Executions</h2>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border" />

          <div className="space-y-4">
            {run.steps.map((step, i) => {
              const s = statusIcon[step.status] ?? statusIcon.PENDING;
              const StepIcon = s.icon;
              const isExpanded = expandedStep === step.id;

              return (
                <div key={step.id} className="relative pl-12">
                  {/* Timeline dot */}
                  <div className={`absolute left-2 top-3 w-5 h-5 rounded-full border-2 bg-card flex items-center justify-center ${
                    step.status === "SUCCESS" ? "border-emerald-500" :
                    step.status === "FAILED" ? "border-red-500" :
                    step.status === "RUNNING" ? "border-sky-500" :
                    step.status === "SKIPPED" ? "border-amber-500" :
                    "border-zinc-600"
                  }`}>
                    <StepIcon className={`w-3 h-3 ${s.color} ${step.status === "RUNNING" ? "animate-spin" : ""}`} />
                  </div>

                  <Card
                    className="glass cursor-pointer hover:border-border/60 transition"
                    onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                          <span className="font-medium text-sm">{step.nodeLabel}</span>
                          <Badge variant="outline" className="text-[10px] font-mono">
                            {step.nodeType}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              step.status === "SUCCESS" ? "success" :
                              step.status === "FAILED" ? "destructive" :
                              "secondary"
                            }
                          >
                            {step.status}
                          </Badge>
                          {step.durationMs != null && (
                            <span className="text-xs text-muted-foreground">
                              {step.durationMs}ms
                            </span>
                          )}
                        </div>
                      </div>

                      {step.error && (
                        <p className="text-xs text-destructive mt-2">{step.error}</p>
                      )}

                      {isExpanded && (
                        <div className="mt-4 space-y-3">
                          <Separator />
                          {step.input != null && (
                            <div>
                              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                                <Code2 className="w-3 h-3" /> Input
                              </p>
                              <pre className="text-xs bg-background/50 p-3 rounded-lg overflow-auto max-h-40 font-mono">
                                {JSON.stringify(step.input, null, 2)}
                              </pre>
                            </div>
                          )}
                          {step.output != null && (
                            <div>
                              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                                <Code2 className="w-3 h-3" /> Output
                              </p>
                              <pre className="text-xs bg-background/50 p-3 rounded-lg overflow-auto max-h-40 font-mono">
                                {JSON.stringify(step.output, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
