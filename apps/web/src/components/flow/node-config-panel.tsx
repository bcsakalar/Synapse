"use client";

import React, { useEffect, useState } from "react";
import type { Node } from "@xyflow/react";
import { NODE_REGISTRY, NodeType, type ConfigField } from "@synapse/shared/constants";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { X, Settings2, Info } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

interface NodeConfigPanelProps {
  node: Node;
  onClose: () => void;
  onUpdate: (nodeId: string, config: Record<string, unknown>) => void;
}

export default function NodeConfigPanel({ node, onClose, onUpdate }: NodeConfigPanelProps) {
  const nodeType = node.type as NodeType;
  const meta = NODE_REGISTRY[nodeType];
  const { t } = useLanguage();
  const [localConfig, setLocalConfig] = useState<Record<string, unknown>>(
    (node.data?.config as Record<string, unknown>) ?? {}
  );

  // Sync when node changes
  useEffect(() => {
    setLocalConfig((node.data?.config as Record<string, unknown>) ?? {});
  }, [node.id, node.data]);

  if (!meta) {
    return (
      <div className="w-80 border-l border-border bg-card p-6">
        <p className="text-muted-foreground text-sm">{t.nodeConfig.unknownType}</p>
      </div>
    );
  }

  const handleFieldChange = (key: string, value: unknown) => {
    const updated = { ...localConfig, [key]: value };
    setLocalConfig(updated);
    onUpdate(node.id, updated);
  };

  const renderField = (field: ConfigField) => {
    const val = localConfig[field.key] ?? "";

    switch (field.type) {
      case "text":
      case "variable":
        return (
          <Input
            value={val as string}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            className="bg-background/50"
          />
        );
      case "textarea":
        return (
          <Textarea
            value={val as string}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            rows={3}
            className="bg-background/50 resize-none"
          />
        );
      case "number":
        return (
          <Input
            type="number"
            value={val as string}
            onChange={(e) => handleFieldChange(field.key, e.target.value ? Number(e.target.value) : "")}
            placeholder={field.placeholder}
            className="bg-background/50"
          />
        );
      case "select":
        return (
          <Select
            value={val as string}
            onValueChange={(v) => handleFieldChange(field.key, v)}
          >
            <SelectTrigger className="bg-background/50">
              <SelectValue placeholder={t.nodeConfig.selectPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "json":
        return (
          <Textarea
            value={typeof val === "string" ? val : JSON.stringify(val, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                handleFieldChange(field.key, parsed);
              } catch {
                handleFieldChange(field.key, e.target.value);
              }
            }}
            placeholder={field.placeholder}
            rows={4}
            className="bg-background/50 resize-none font-mono text-xs"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-80 border-l border-border bg-card flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-muted-foreground" />
          <span className="font-semibold text-sm">{t.nodeConfig.title}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-7 w-7 p-0">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Node Info */}
      <div className="p-4 border-b border-border">
        <h3 className="font-medium text-sm">{(t.nodes as Record<string, string>)[nodeType] ?? meta.label}</h3>
        <p className="text-xs text-muted-foreground mt-1">{(t.nodes as Record<string, string>)[nodeType + "_desc"] ?? meta.description}</p>
        <div className="flex gap-2 mt-2">
          <Badge variant="secondary" className="text-xs">{meta.category}</Badge>
          <Badge variant="outline" className="text-xs font-mono">{node.id}</Badge>
        </div>
      </div>

      <Separator />

      {/* Config Fields */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {meta.configFields.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">
              {t.nodeConfig.noConfig}
            </p>
          ) : (
            meta.configFields.map((field) => (
              <div key={field.key} className="space-y-1.5">
                <div className="flex items-center gap-1">
                  <Label className="text-xs font-medium">{field.label}</Label>
                  {field.required && <span className="text-red-400 text-xs">*</span>}
                </div>
                {field.description && (
                  <div className="flex items-start gap-1 text-xs text-muted-foreground">
                    <Info className="w-3 h-3 mt-0.5 shrink-0" />
                    <span>{field.description}</span>
                  </div>
                )}
                {renderField(field)}
                {field.type === "variable" && (
                  <p className="text-[10px] text-muted-foreground">
                    {t.nodeConfig.variableHint}
                  </p>
                )}
              </div>
            ))
          )}

          {/* Custom Label */}
          <Separator className="my-4" />
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">{t.nodeConfig.nodeLabel}</Label>
            <Input
              value={(node.data?.label as string) ?? meta.label}
              onChange={(e) => handleFieldChange("__label", e.target.value)}
              className="bg-background/50"
              placeholder={t.nodeConfig.customLabel}
            />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
