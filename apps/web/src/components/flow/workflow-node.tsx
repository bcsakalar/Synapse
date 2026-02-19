"use client";

import React, { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { cn } from "@/lib/utils";
import {
  Webhook, Clock, Mail, Send, MessageCircle, Hash, Globe,
  Sparkles, Wand2, GitBranch, Timer, Shuffle,
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Webhook, Clock, Mail, Send, MessageCircle, Hash, Globe,
  Sparkles, Wand2, GitBranch, Timer, Shuffle,
};

const COLOR_MAP: Record<string, { bg: string; border: string; glow: string; icon: string }> = {
  emerald: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    glow: "shadow-emerald-500/20",
    icon: "text-emerald-400",
  },
  red: {
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    glow: "shadow-red-500/20",
    icon: "text-red-400",
  },
  sky: {
    bg: "bg-sky-500/10",
    border: "border-sky-500/30",
    glow: "shadow-sky-500/20",
    icon: "text-sky-400",
  },
  indigo: {
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/30",
    glow: "shadow-indigo-500/20",
    icon: "text-indigo-400",
  },
  green: {
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    glow: "shadow-green-500/20",
    icon: "text-green-400",
  },
  orange: {
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    glow: "shadow-orange-500/20",
    icon: "text-orange-400",
  },
  purple: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    glow: "shadow-purple-500/20",
    icon: "text-purple-400",
  },
  amber: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    glow: "shadow-amber-500/20",
    icon: "text-amber-400",
  },
};

interface WorkflowNodeData {
  label: string;
  nodeType: string;
  config?: Record<string, unknown>;
  status?: "idle" | "running" | "success" | "failed";
  [key: string]: unknown;
}

// Node type to metadata mapping (inline to avoid importing server-side module)
const NODE_META: Record<string, { icon: string; color: string; category: string; outputs: number }> = {
  trigger_webhook: { icon: "Webhook", color: "emerald", category: "trigger", outputs: 1 },
  trigger_cron: { icon: "Clock", color: "emerald", category: "trigger", outputs: 1 },
  action_gmail_send: { icon: "Mail", color: "red", category: "action", outputs: 1 },
  action_telegram_msg: { icon: "Send", color: "sky", category: "action", outputs: 1 },
  action_discord_msg: { icon: "MessageCircle", color: "indigo", category: "action", outputs: 1 },
  action_slack_msg: { icon: "Hash", color: "green", category: "action", outputs: 1 },
  action_http_request: { icon: "Globe", color: "orange", category: "action", outputs: 1 },
  action_gemini_summarize: { icon: "Sparkles", color: "purple", category: "ai", outputs: 1 },
  action_gemini_transform: { icon: "Wand2", color: "purple", category: "ai", outputs: 1 },
  logic_condition: { icon: "GitBranch", color: "amber", category: "logic", outputs: 2 },
  logic_delay: { icon: "Timer", color: "amber", category: "logic", outputs: 1 },
  logic_transform: { icon: "Shuffle", color: "amber", category: "logic", outputs: 1 },
};

function WorkflowNode({ data, selected }: NodeProps & { data: WorkflowNodeData }) {
  const nodeType = data.nodeType || "trigger_webhook";
  const meta = NODE_META[nodeType] || NODE_META.trigger_webhook;
  const colors = COLOR_MAP[meta.color] || COLOR_MAP.emerald;
  const IconComponent = ICON_MAP[meta.icon] || Webhook;

  const statusClass =
    data.status === "running"
      ? "node-glow-running"
      : data.status === "success"
      ? "node-glow-success"
      : data.status === "failed"
      ? "node-glow-error"
      : "";

  const isTrigger = meta.category === "trigger";
  const isCondition = nodeType === "logic_condition";

  return (
    <div
      className={cn(
        "relative min-w-[200px] rounded-xl border px-4 py-3 backdrop-blur-sm transition-all duration-300",
        colors.bg,
        colors.border,
        selected && `ring-2 ring-primary/50 ${colors.glow} shadow-lg`,
        statusClass
      )}
    >
      {/* Input Handle */}
      {!isTrigger && (
        <Handle
          type="target"
          position={Position.Top}
          className="!w-3 !h-3 !bg-zinc-600 !border-2 !border-zinc-400 hover:!bg-primary transition-colors"
        />
      )}

      {/* Node Content */}
      <div className="flex items-center gap-3">
        <div className={cn("flex items-center justify-center w-9 h-9 rounded-lg", colors.bg)}>
          <IconComponent className={cn("w-5 h-5", colors.icon)} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{data.label}</p>
          <p className="text-xs text-muted-foreground truncate capitalize">
            {nodeType.replace(/_/g, " ")}
          </p>
        </div>
        {data.status && (
          <div
            className={cn(
              "w-2 h-2 rounded-full",
              data.status === "running" && "bg-blue-400 animate-pulse",
              data.status === "success" && "bg-emerald-400",
              data.status === "failed" && "bg-red-400"
            )}
          />
        )}
      </div>

      {/* Output Handle(s) */}
      {isCondition ? (
        <>
          <Handle
            type="source"
            position={Position.Bottom}
            id="true"
            className="!w-3 !h-3 !bg-emerald-500 !border-2 !border-emerald-300 hover:!bg-emerald-400 transition-colors !left-[30%]"
          />
          <Handle
            type="source"
            position={Position.Bottom}
            id="false"
            className="!w-3 !h-3 !bg-red-500 !border-2 !border-red-300 hover:!bg-red-400 transition-colors !left-[70%]"
          />
          <div className="flex justify-between mt-1.5 px-2">
            <span className="text-[10px] text-emerald-400">True</span>
            <span className="text-[10px] text-red-400">False</span>
          </div>
        </>
      ) : (
        <Handle
          type="source"
          position={Position.Bottom}
          className="!w-3 !h-3 !bg-zinc-600 !border-2 !border-zinc-400 hover:!bg-primary transition-colors"
        />
      )}
    </div>
  );
}

export default memo(WorkflowNode);
