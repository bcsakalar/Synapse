"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  LayoutTemplate, Workflow, Sparkles, Loader2,
  Mail, Send, MessageCircle, Globe, GitBranch,
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/language-context";
import type { TranslationSchema } from "@/i18n";

function getTemplates(t: TranslationSchema) {
  return [
    {
      id: "tpl-webhook-telegram",
      name: t.templates.tplWebhookTelegram,
      description: t.templates.tplWebhookTelegramDesc,
      tags: ["webhook", "telegram"],
      icon: Send,
      color: "text-sky-400",
      prompt: "When a webhook is received, send the data as a message to Telegram",
    },
    {
      id: "tpl-webhook-ai-email",
      name: t.templates.tplWebhookAiEmail,
      description: t.templates.tplWebhookAiEmailDesc,
      tags: ["webhook", "ai", "gmail"],
      icon: Sparkles,
      color: "text-purple-400",
      prompt: "When a webhook fires, summarize the data with AI, then send the summary via Gmail",
    },
    {
      id: "tpl-webhook-condition-notify",
      name: t.templates.tplWebhookConditionNotify,
      description: t.templates.tplWebhookConditionNotifyDesc,
      tags: ["webhook", "condition", "discord", "slack"],
      icon: GitBranch,
      color: "text-amber-400",
      prompt: "When a webhook is received, check if the data contains 'urgent'. If true, send to Discord. If false, send to Slack.",
    },
    {
      id: "tpl-webhook-http-transform",
      name: t.templates.tplWebhookHttpTransform,
      description: t.templates.tplWebhookHttpTransformDesc,
      tags: ["webhook", "http", "transform", "telegram"],
      icon: Globe,
      color: "text-orange-400",
      prompt: "When a webhook is received, make an HTTP GET request to the URL in the data, transform the response to extract the title field, then send it to Telegram",
    },
    {
      id: "tpl-ai-pipeline",
      name: t.templates.tplAiPipeline,
      description: t.templates.tplAiPipelineDesc,
      tags: ["webhook", "ai"],
      icon: Sparkles,
      color: "text-purple-400",
      prompt: "When a webhook fires, summarize the content with AI, then transform it into JSON format, then send via Telegram",
    },
    {
      id: "tpl-multi-notify",
      name: t.templates.tplMultiNotify,
      description: t.templates.tplMultiNotifyDesc,
      tags: ["webhook", "telegram", "discord", "slack"],
      icon: MessageCircle,
      color: "text-indigo-400",
      prompt: "When a webhook is received, send the message to Telegram, Discord, and Slack",
    },
  ];
}

export default function TemplatesPage() {
  const router = useRouter();
  const [generating, setGenerating] = useState<string | null>(null);
  const { t } = useLanguage();
  const TEMPLATES = getTemplates(t);

  const handleUseTemplate = async (template: ReturnType<typeof getTemplates>[0]) => {
    setGenerating(template.id);
    try {
      const parseRes = await fetch("/api/workflows/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: template.prompt }),
      });
      const parseData = await parseRes.json();
      if (!parseData.success) throw new Error(parseData.error);

      const createRes = await fetch("/api/workflows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: template.name,
          nodes: parseData.data.nodes,
          edges: parseData.data.edges,
          naturalLanguagePrompt: template.prompt,
        }),
      });
      const createData = await createRes.json();
      if (!createData.success) throw new Error(createData.error);

      toast.success(t.templates.created);
      router.push(`/dashboard/workflows/${createData.data.id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t.templates.failedCreate);
    } finally {
      setGenerating(null);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <LayoutTemplate className="w-6 h-6 text-purple-400" />
          {t.templates.title}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t.templates.subtitle}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TEMPLATES.map((tpl) => (
          <Card key={tpl.id} className="glass hover:border-border/60 transition group flex flex-col">
            <CardContent className="p-5 flex flex-col flex-1">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center shrink-0">
                  <tpl.icon className={`w-5 h-5 ${tpl.color}`} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-sm">{tpl.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{tpl.description}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mb-4">
                {tpl.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-[10px]">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="mt-auto">
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => handleUseTemplate(tpl)}
                  disabled={generating === tpl.id}
                >
                  {generating === tpl.id ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      {t.templates.generating}
                    </>
                  ) : (
                    t.templates.useTemplate
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
