"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Workflow, Link2, Zap, Play, Plus, ArrowRight, Activity,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

interface Stats {
  workflows: number;
  activeWorkflows: number;
  integrations: number;
  totalRuns: number;
  recentRuns: Array<{
    id: string;
    status: string;
    workflowName: string;
    createdAt: string;
  }>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    // Fetch user
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => d.success && setUser(d.data));

    // Fetch workflows for stats
    fetch("/api/workflows")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          const workflows = d.data || [];
          setStats({
            workflows: workflows.length,
            activeWorkflows: workflows.filter((w: { isActive: boolean }) => w.isActive).length,
            integrations: 0,
            totalRuns: workflows.reduce((acc: number, w: { _count?: { runs: number } }) => acc + (w._count?.runs ?? 0), 0),
            recentRuns: [],
          });
        }
      });

    // Fetch integrations count
    fetch("/api/integrations")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setStats((prev) => prev ? { ...prev, integrations: d.data.length } : prev);
        }
      });
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold">
          {t.dashboard.welcomeBack}{user ? `, ${user.name}` : ""}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t.dashboard.overview}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: t.dashboard.workflows,
            value: stats?.workflows ?? "—",
            icon: Workflow,
            color: "text-purple-400",
            bg: "bg-purple-500/10",
          },
          {
            label: t.dashboard.active,
            value: stats?.activeWorkflows ?? "—",
            icon: Zap,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
          },
          {
            label: t.dashboard.integrations,
            value: stats?.integrations ?? "—",
            icon: Link2,
            color: "text-sky-400",
            bg: "bg-sky-500/10",
          },
          {
            label: t.dashboard.totalRuns,
            value: stats?.totalRuns ?? "—",
            icon: Activity,
            color: "text-amber-400",
            bg: "bg-amber-500/10",
          },
        ].map((s) => (
          <Card key={s.label} className="glass">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="glass hover:border-purple-500/30 transition group">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Plus className="w-5 h-5 text-purple-400" />
              {t.dashboard.createWorkflow}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {t.dashboard.createWorkflowDesc}
            </p>
            <Link href="/dashboard/workflows/new">
              <Button size="sm" className="group-hover:bg-primary/90">
                {t.dashboard.newWorkflow} <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="glass hover:border-sky-500/30 transition group">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Play className="w-5 h-5 text-sky-400" />
              {t.dashboard.browseTemplates}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {t.dashboard.browseTemplatesDesc}
            </p>
            <Link href="/dashboard/templates">
              <Button size="sm" variant="outline" className="group-hover:bg-accent">
                {t.dashboard.viewTemplates} <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
