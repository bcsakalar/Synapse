"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Webhook, RefreshCw, ChevronRight, Code2, Clock, Loader2, Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/language-context";

interface WebhookEndpoint {
  id: string;
  path: string;
  workflow: { id: string; name: string };
  createdAt: string;
}

interface WebhookLog {
  id: string;
  method: string;
  headers: Record<string, string>;
  body: unknown;
  queryParams: Record<string, string>;
  sourceIp: string;
  processedAt: string | null;
  createdAt: string;
  endpoint: { path: string; workflow: { name: string } };
}

export default function WebhookDebuggerPage() {
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedLog, setExpandedLog] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { t } = useLanguage();

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/webhooks/logs");
      const data = await res.json();
      if (data.success) setLogs(data.data);
    } catch {
      // Endpoint may not exist yet, that's okay
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(fetchLogs, 3000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoRefresh]);

  const getMethodColor = (method: string) => {
    switch (method) {
      case "POST": return "text-emerald-400 bg-emerald-500/10";
      case "GET": return "text-sky-400 bg-sky-500/10";
      case "PUT": return "text-amber-400 bg-amber-500/10";
      case "DELETE": return "text-red-400 bg-red-500/10";
      default: return "text-muted-foreground bg-muted";
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Webhook className="w-6 h-6 text-purple-400" />
            {t.webhooks.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t.webhooks.subtitle}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={autoRefresh ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            {autoRefresh ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-1" />
            )}
            {autoRefresh ? "Live" : t.webhooks.autoRefresh}
          </Button>
          <Button variant="outline" size="sm" onClick={fetchLogs}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="glass animate-pulse h-16" />
          ))}
        </div>
      ) : logs.length === 0 ? (
        <Card className="glass">
          <CardContent className="py-16 text-center">
            <Webhook className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">{t.webhooks.noLogs}</h3>
            <p className="text-sm text-muted-foreground">
              {t.webhooks.noLogsDesc}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => {
            const isExpanded = expandedLog === log.id;
            return (
              <Card
                key={log.id}
                className="glass hover:border-border/60 transition cursor-pointer"
                onClick={() => setExpandedLog(isExpanded ? null : log.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ChevronRight
                        className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-90" : ""}`}
                      />
                      <Badge className={getMethodColor(log.method)}>
                        {log.method}
                      </Badge>
                      <span className="text-sm font-mono">
                        /{log.endpoint?.path || "?"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        → {log.endpoint?.workflow?.name || "Unknown"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">{log.sourceIp}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(log.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 space-y-3">
                      <Separator />
                      <div>
                        <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                          <Code2 className="w-3 h-3" /> {t.webhooks.headers}
                        </p>
                        <pre className="text-xs bg-background/50 p-3 rounded-lg overflow-auto max-h-32 font-mono">
                          {JSON.stringify(log.headers, null, 2)}
                        </pre>
                      </div>
                      {log.queryParams && Object.keys(log.queryParams).length > 0 && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                            <Code2 className="w-3 h-3" /> {t.webhooks.queryParams}
                          </p>
                          <pre className="text-xs bg-background/50 p-3 rounded-lg overflow-auto max-h-32 font-mono">
                            {JSON.stringify(log.queryParams, null, 2)}
                          </pre>
                        </div>
                      )}
                      {log.body != null && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                            <Code2 className="w-3 h-3" /> {t.webhooks.body}
                          </p>
                          <pre className="text-xs bg-background/50 p-3 rounded-lg overflow-auto max-h-40 font-mono">
                            {typeof log.body === "string" ? log.body : JSON.stringify(log.body, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
