"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Workflow, Play, Trash2, MoreVertical, Clock } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/language-context";

interface WorkflowItem {
  id: string;
  name: string;
  isActive: boolean;
  naturalLanguagePrompt: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: { runs: number };
}

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<WorkflowItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  const fetchWorkflows = async () => {
    const res = await fetch("/api/workflows");
    const data = await res.json();
    if (data.success) setWorkflows(data.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm(t.workflows.deleteConfirm)) return;
    const res = await fetch(`/api/workflows/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      toast.success(t.workflows.deleted);
      fetchWorkflows();
    } else {
      toast.error(data.error);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t.workflows.title}</h1>
          <p className="text-sm text-muted-foreground">{t.workflows.subtitle}</p>
        </div>
        <Link href="/dashboard/workflows/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" /> {t.workflows.newWorkflow}
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="glass animate-pulse h-24" />
          ))}
        </div>
      ) : workflows.length === 0 ? (
        <Card className="glass">
          <CardContent className="py-16 text-center">
            <Workflow className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">{t.workflows.noWorkflows}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t.workflows.noWorkflowsDesc}
            </p>
            <Link href="/dashboard/workflows/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" /> {t.workflows.createWorkflow}
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {workflows.map((w) => (
            <Card key={w.id} className="glass hover:border-border/60 transition group">
              <CardContent className="p-5 flex items-center justify-between">
                <Link href={`/dashboard/workflows/${w.id}`} className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                      <Workflow className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-medium truncate">{w.name}</h3>
                      {w.naturalLanguagePrompt && (
                        <p className="text-xs text-muted-foreground truncate max-w-md">
                          {w.naturalLanguagePrompt}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
                <div className="flex items-center gap-3">
                  <Badge variant={w.isActive ? "success" : "secondary"}>
                    {w.isActive ? t.common.active : t.common.inactive}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Play className="w-3 h-3" />
                    {w._count?.runs ?? 0} {t.common.runs}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {new Date(w.updatedAt).toLocaleDateString()}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition"
                    onClick={() => handleDelete(w.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
