"use client";

import React, { useCallback, useState, useRef, useEffect } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Node,
  type Edge,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import WorkflowNode from "./workflow-node";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles, Save, Play, Loader2, Power, PowerOff, History,
} from "lucide-react";
import { toast } from "sonner";
import NodeConfigPanel from "./node-config-panel";
import { useExecutionStatus } from "@/hooks/use-execution-status";
import { useLanguage } from "@/contexts/language-context";

const nodeTypes = {
  trigger_webhook: WorkflowNode,
  trigger_cron: WorkflowNode,
  action_gmail_send: WorkflowNode,
  action_telegram_msg: WorkflowNode,
  action_discord_msg: WorkflowNode,
  action_slack_msg: WorkflowNode,
  action_http_request: WorkflowNode,
  action_gemini_summarize: WorkflowNode,
  action_gemini_transform: WorkflowNode,
  logic_condition: WorkflowNode,
  logic_delay: WorkflowNode,
  logic_transform: WorkflowNode,
};

interface WorkflowCanvasProps {
  workflowId?: string;
  initialNodes?: Node[];
  initialEdges?: Edge[];
  initialName?: string;
  webhookUrl?: string | null;
  isActive?: boolean;
}

export default function WorkflowCanvas({
  workflowId,
  initialNodes = [],
  initialEdges = [],
  initialName = "Untitled Workflow",
  webhookUrl,
  isActive: initialActive = false,
}: WorkflowCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [nlPrompt, setNlPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isActive, setIsActive] = useState(initialActive);
  const [workflowName, setWorkflowName] = useState(initialName);
  const [activeRunId, setActiveRunId] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const promptRef = useRef<HTMLInputElement>(null);
  const { t, lang } = useLanguage();

  const { getNodeStatus } = useExecutionStatus(activeRunId);

  // Update node data with live execution statuses
  useEffect(() => {
    if (!activeRunId) return;
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        data: { ...n.data, status: getNodeStatus(n.id) },
      }))
    );
  }, [activeRunId, getNodeStatus, setNodes]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // Generate workflow from natural language
  const handleGenerate = useCallback(async () => {
    if (!nlPrompt.trim()) {
      toast.error(t.canvas.describeFirst);
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch("/api/workflows/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: nlPrompt, lang }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      setNodes(data.data.nodes);
      setEdges(data.data.edges);
      setWorkflowName(data.data.metadata.name);
      toast.success(t.canvas.generated);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t.canvas.failedGenerate);
    } finally {
      setIsGenerating(false);
    }
  }, [nlPrompt, setNodes, setEdges, t, lang]);

  // Save workflow
  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      const url = workflowId ? `/api/workflows/${workflowId}` : "/api/workflows";
      const method = workflowId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: workflowName,
          nodes,
          edges,
          dagDefinition: {
            nodes: nodes.map((n) => ({ id: n.id, type: n.type, data: n.data })),
            edges: edges.map((e) => ({ source: e.source, target: e.target, sourceHandle: e.sourceHandle })),
          },
          naturalLanguagePrompt: nlPrompt || undefined,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      toast.success(t.canvas.saved);

      // Redirect to the workflow page if newly created
      if (!workflowId && data.data?.id) {
        window.location.href = `/dashboard/workflows/${data.data.id}`;
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t.canvas.failedSave);
    } finally {
      setIsSaving(false);
    }
  }, [workflowId, workflowName, nodes, edges, nlPrompt]);

  // Toggle active
  const handleToggleActive = useCallback(async () => {
    if (!workflowId) {
      toast.error(t.canvas.saveFirst);
      return;
    }

    try {
      const res = await fetch(`/api/workflows/${workflowId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      setIsActive(!isActive);
      toast.success(isActive ? t.canvas.deactivated : t.canvas.activated);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t.canvas.failedToggle);
    }
  }, [workflowId, isActive, t]);

  // Manual trigger run
  const handleRun = useCallback(async () => {
    if (!workflowId) {
      toast.error(t.canvas.saveFirst);
      return;
    }

    setIsRunning(true);
    try {
      const res = await fetch(`/api/workflows/${workflowId}/trigger`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ triggerData: { manual: true, timestamp: Date.now() } }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      setActiveRunId(data.data.runId);
      toast.success(t.canvas.triggered);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t.canvas.failedRun);
    } finally {
      setIsRunning(false);
    }
  }, [workflowId]);

  const updateNodeConfig = useCallback(
    (nodeId: string, config: Record<string, unknown>) => {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === nodeId
            ? { ...n, data: { ...n.data, config: { ...(n.data.config as Record<string, unknown>), ...config } } }
            : n
        )
      );
    },
    [setNodes]
  );

  return (
    <div className="h-full w-full flex">
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          fitView
          proOptions={{ hideAttribution: true }}
          className="bg-background"
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#27272a" />
          <MiniMap
            className="!bg-card !border-border"
            nodeColor="#a78bfa"
            maskColor="rgba(0,0,0,0.7)"
          />
          <Controls className="!bg-card !border-border !rounded-lg [&>button]:!bg-card [&>button]:!border-border [&>button]:!text-foreground [&>button:hover]:!bg-accent" />

          {/* Top Panel — NL Input + Actions */}
          <Panel position="top-center" className="w-full max-w-3xl px-4">
            <div className="glass rounded-xl p-3 flex gap-2 items-center">
              <Sparkles className="w-5 h-5 text-purple-400 shrink-0" />
              <Input
                ref={promptRef}
                value={nlPrompt}
                onChange={(e) => setNlPrompt(e.target.value)}
                placeholder={t.canvas.promptPlaceholder}
                className="bg-transparent border-none focus-visible:ring-0 text-sm"
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              />
              <Button
                size="sm"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="shrink-0"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  t.canvas.generate
                )}
              </Button>
            </div>
          </Panel>

          {/* Bottom Panel — Workflow Info + Save */}
          <Panel position="bottom-center" className="w-full max-w-2xl px-4 pb-4">
            <div className="glass rounded-xl p-3 flex gap-3 items-center justify-between">
              <div className="flex items-center gap-2">
                <Input
                  value={workflowName}
                  onChange={(e) => setWorkflowName(e.target.value)}
                  className="bg-transparent border-none focus-visible:ring-0 text-sm font-medium w-48"
                />
                <Badge variant={isActive ? "success" : "secondary"}>
                  {isActive ? t.common.active : t.common.inactive}
                </Badge>
                {webhookUrl && (
                  <Badge
                    variant="info"
                    className="cursor-pointer max-w-[200px] truncate"
                    onClick={() => {
                      navigator.clipboard.writeText(webhookUrl);
                      toast.success(t.canvas.webhookCopied);
                    }}
                  >
                    {webhookUrl.split("/").pop()?.slice(0, 8)}...
                  </Badge>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleToggleActive}
                  disabled={!workflowId}
                >
                  {isActive ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleRun}
                  disabled={!workflowId || isRunning}
                  className="text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
                >
                  {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                  <span className="ml-1">{t.canvas.run}</span>
                </Button>
                {workflowId && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.location.href = `/dashboard/workflows/${workflowId}/runs`}
                  >
                    <History className="w-4 h-4" />
                  </Button>
                )}
                <Button size="sm" onClick={handleSave} disabled={isSaving}>
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span className="ml-1">{t.canvas.save}</span>
                </Button>
              </div>
            </div>
          </Panel>
        </ReactFlow>
      </div>

      {/* Node config side panel */}
      {selectedNode && (
        <NodeConfigPanel
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          onUpdate={updateNodeConfig}
        />
      )}
    </div>
  );
}
