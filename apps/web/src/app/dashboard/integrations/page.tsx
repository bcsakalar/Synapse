"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Plus, Trash2, Mail, Send, MessageCircle, Hash, Loader2, ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/language-context";

interface Integration {
  id: string;
  provider: string;
  label: string;
  metadata: Record<string, string>;
  createdAt: string;
}

const providerConfig: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string; fields: { key: string; label: string; type?: string }[] }> = {
  GMAIL: {
    icon: Mail,
    color: "text-red-400",
    fields: [
      { key: "clientId", label: "Client ID" },
      { key: "clientSecret", label: "Client Secret", type: "password" },
    ],
  },
  TELEGRAM: {
    icon: Send,
    color: "text-sky-400",
    fields: [
      { key: "botToken", label: "Bot Token", type: "password" },
      { key: "chatId", label: "Chat ID" },
    ],
  },
  DISCORD: {
    icon: MessageCircle,
    color: "text-indigo-400",
    fields: [{ key: "webhookUrl", label: "Webhook URL" }],
  },
  SLACK: {
    icon: Hash,
    color: "text-green-400",
    fields: [{ key: "webhookUrl", label: "Webhook URL" }],
  },
};

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [provider, setProvider] = useState("TELEGRAM");
  const [label, setLabel] = useState("");
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const { t } = useLanguage();

  const fetchIntegrations = async () => {
    const res = await fetch("/api/integrations");
    const data = await res.json();
    if (data.success) setIntegrations(data.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (provider === "GMAIL") {
        // Gmail uses OAuth flow
        const res = await fetch("/api/integrations/google/authorize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clientId: credentials.clientId,
            clientSecret: credentials.clientSecret,
            label: label || "Gmail",
          }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
        window.location.href = data.data.authUrl;
        return;
      }

      const res = await fetch("/api/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, label, credentials }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      toast.success(t.integrations.added);
      setDialogOpen(false);
      setLabel("");
      setCredentials({});
      fetchIntegrations();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t.integrations.failedSave);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t.integrations.removeConfirm)) return;
    const res = await fetch(`/api/integrations/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      toast.success(t.integrations.removed);
      fetchIntegrations();
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t.integrations.title}</h1>
          <p className="text-sm text-muted-foreground">
            {t.integrations.subtitle}
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" /> {t.integrations.addIntegration}
            </Button>
          </DialogTrigger>
          <DialogContent className="glass">
            <DialogHeader>
              <DialogTitle>{t.integrations.addIntegration}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>{t.integrations.provider}</Label>
                <Select value={provider} onValueChange={(v) => { setProvider(v); setCredentials({}); }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GMAIL">Gmail (OAuth2)</SelectItem>
                    <SelectItem value="TELEGRAM">Telegram</SelectItem>
                    <SelectItem value="DISCORD">Discord</SelectItem>
                    <SelectItem value="SLACK">Slack</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t.integrations.label}</Label>
                <Input
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder={`My ${provider.charAt(0) + provider.slice(1).toLowerCase()}`}
                />
              </div>
              <Separator />
              {providerConfig[provider]?.fields.map((f) => (
                <div key={f.key} className="space-y-2">
                  <Label>{f.label}</Label>
                  <Input
                    type={f.type ?? "text"}
                    value={credentials[f.key] ?? ""}
                    onChange={(e) => setCredentials({ ...credentials, [f.key]: e.target.value })}
                  />
                </div>
              ))}
              <Button onClick={handleSave} disabled={saving} className="w-full">
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {provider === "GMAIL" ? t.integrations.connectGoogle : t.integrations.saveIntegration}
                {provider === "GMAIL" && <ExternalLink className="w-4 h-4 ml-1" />}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <Card key={i} className="glass animate-pulse h-20" />
          ))}
        </div>
      ) : integrations.length === 0 ? (
        <Card className="glass">
          <CardContent className="py-12 text-center text-muted-foreground">
            {t.integrations.noIntegrations}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {integrations.map((int) => {
            const cfg = providerConfig[int.provider];
            const ProviderIcon = cfg?.icon ?? Mail;
            return (
              <Card key={int.id} className="glass group">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ProviderIcon className={`w-5 h-5 ${cfg?.color ?? "text-muted-foreground"}`} />
                    <div>
                      <p className="font-medium text-sm">{int.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {int.metadata?.email || int.metadata?.botName || int.provider}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{int.provider}</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100"
                      onClick={() => handleDelete(int.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
