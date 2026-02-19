"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, CheckCircle2, XCircle, Loader2, AlertTriangle } from "lucide-react";

interface Run {
  id: string;
  status: string;
  startedAt: string | null;
  completedAt: string | null;
  error: string | null;
  createdAt: string;
}

const statusConfig: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string; variant: "success" | "destructive" | "warning" | "info" | "secondary" }> = {
  COMPLETED: { icon: CheckCircle2, color: "text-emerald-400", variant: "success" },
  FAILED: { icon: XCircle, color: "text-red-400", variant: "destructive" },
  RUNNING: { icon: Loader2, color: "text-sky-400", variant: "info" },
  PENDING: { icon: Clock, color: "text-muted-foreground", variant: "secondary" },
  PARTIAL: { icon: AlertTriangle, color: "text-amber-400", variant: "warning" },
};

export default function WorkflowRunsPage() {
  const params = useParams();
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/workflows/${params.id}/runs`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setRuns(d.data);
        setLoading(false);
      });
  }, [params.id]);

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/workflows/${params.id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Editor
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Execution History</h1>
          <p className="text-sm text-muted-foreground">All runs for this workflow</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="glass animate-pulse h-16" />
          ))}
        </div>
      ) : runs.length === 0 ? (
        <Card className="glass">
          <CardContent className="py-12 text-center text-muted-foreground">
            No runs yet. Trigger the workflow to see execution history.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {runs.map((run) => {
            const cfg = statusConfig[run.status] ?? statusConfig.PENDING;
            const StatusIcon = cfg.icon;
            const duration =
              run.startedAt && run.completedAt
                ? `${((new Date(run.completedAt).getTime() - new Date(run.startedAt).getTime()) / 1000).toFixed(1)}s`
                : null;

            return (
              <Link key={run.id} href={`/dashboard/workflows/${params.id}/runs/${run.id}`}>
                <Card className="glass hover:border-border/60 transition cursor-pointer">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <StatusIcon
                        className={`w-5 h-5 ${cfg.color} ${run.status === "RUNNING" ? "animate-spin" : ""}`}
                      />
                      <div>
                        <span className="text-sm font-mono">{run.id.slice(0, 8)}...</span>
                        {run.error && (
                          <p className="text-xs text-destructive mt-0.5 truncate max-w-md">{run.error}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={cfg.variant}>{run.status}</Badge>
                      {duration && (
                        <span className="text-xs text-muted-foreground">{duration}</span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {new Date(run.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
