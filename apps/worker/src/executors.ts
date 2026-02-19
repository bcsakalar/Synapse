// ─── Node Executor Registry ───
// Each executor takes config + input and returns output

import { db, decryptCredentials, type EncryptedData } from "@synapse/shared";

// Helper to reconstruct EncryptedData from DB columns
function getEncryptedData(integration: { encryptedCredentials: string; iv: string; authTag: string }): EncryptedData {
  return {
    ciphertext: integration.encryptedCredentials,
    iv: integration.iv,
    authTag: integration.authTag,
  };
}

export type ExecutorResult = {
  success: boolean;
  output: Record<string, unknown>;
  error?: string;
};

export type NodeExecutor = (
  config: Record<string, unknown>,
  input: Record<string, unknown>,
  context: { userId: string }
) => Promise<ExecutorResult>;

// ─── Gmail Send ───
export const executeGmailSend: NodeExecutor = async (config, input, ctx) => {
  const integrationId = config.integrationId as string;
  if (!integrationId) throw new Error("No Gmail integration selected");

  const integration = await db.integration.findFirst({
    where: { id: integrationId, userId: ctx.userId },
  });
  if (!integration) throw new Error("Gmail integration not found");

  const creds = decryptCredentials<{ clientId: string; clientSecret: string; accessToken: string; refreshToken: string }>(getEncryptedData(integration));

  // Use googleapis to send email
  const { google } = await import("googleapis");
  const oauth2Client = new google.auth.OAuth2(creds.clientId, creds.clientSecret);
  oauth2Client.setCredentials({
    access_token: creds.accessToken,
    refresh_token: creds.refreshToken,
  });

  const gmail = google.gmail({ version: "v1", auth: oauth2Client });

  const to = interpolateField(config.to as string, input);
  const subject = interpolateField(config.subject as string, input);
  const body = interpolateField(config.body as string, input);

  const message = [
    `To: ${to}`,
    `Subject: ${subject}`,
    "Content-Type: text/html; charset=utf-8",
    "",
    body,
  ].join("\n");

  const encodedMessage = Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const res = await gmail.users.messages.send({
    userId: "me",
    requestBody: { raw: encodedMessage },
  });

  return { success: true, output: { messageId: res.data.id, to, subject } };
};

// ─── Telegram Send ───
export const executeTelegramSend: NodeExecutor = async (config, input, ctx) => {
  const integrationId = config.integrationId as string;
  if (!integrationId) throw new Error("No Telegram integration selected");

  const integration = await db.integration.findFirst({
    where: { id: integrationId, userId: ctx.userId },
  });
  if (!integration) throw new Error("Telegram integration not found");

  const creds = decryptCredentials<{ botToken: string; chatId: string }>(getEncryptedData(integration));
  const message = interpolateField(config.message as string, input);

  const res = await fetch(
    `https://api.telegram.org/bot${creds.botToken}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: creds.chatId, text: message, parse_mode: "HTML" }),
    }
  );
  const data = await res.json() as { ok: boolean; description?: string; result?: { message_id: number } };

  if (!data.ok) throw new Error(`Telegram error: ${data.description}`);

  return { success: true, output: { messageId: data.result?.message_id, chatId: creds.chatId } };
};

// ─── Discord Send ───
export const executeDiscordSend: NodeExecutor = async (config, input, ctx) => {
  const integrationId = config.integrationId as string;
  if (!integrationId) throw new Error("No Discord integration selected");

  const integration = await db.integration.findFirst({
    where: { id: integrationId, userId: ctx.userId },
  });
  if (!integration) throw new Error("Discord integration not found");

  const creds = decryptCredentials<{ webhookUrl: string }>(getEncryptedData(integration));
  const content = interpolateField(config.content as string, input);
  const username = config.username as string | undefined;

  const res = await fetch(creds.webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, username: username || "Synapse Bot" }),
  });

  if (!res.ok) throw new Error(`Discord API error: ${res.status}`);

  return { success: true, output: { sent: true, contentLength: content.length } };
};

// ─── Slack Send ───
export const executeSlackSend: NodeExecutor = async (config, input, ctx) => {
  const integrationId = config.integrationId as string;
  if (!integrationId) throw new Error("No Slack integration selected");

  const integration = await db.integration.findFirst({
    where: { id: integrationId, userId: ctx.userId },
  });
  if (!integration) throw new Error("Slack integration not found");

  const creds = decryptCredentials<{ webhookUrl: string }>(getEncryptedData(integration));
  const text = interpolateField(config.text as string, input);

  const res = await fetch(creds.webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) throw new Error(`Slack API error: ${res.status}`);

  return { success: true, output: { sent: true, textLength: text.length } };
};

// ─── HTTP Request ───
export const executeHttpRequest: NodeExecutor = async (config, input) => {
  const url = interpolateField(config.url as string, input);
  const method = (config.method as string) || "GET";
  const headers = typeof config.headers === "object" && config.headers !== null
    ? (config.headers as Record<string, string>)
    : {};
  const body = config.body ? JSON.stringify(config.body) : undefined;

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json", ...headers },
    body: method !== "GET" ? body : undefined,
  });

  let responseData: unknown;
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    responseData = await res.json();
  } else {
    responseData = await res.text();
  }

  return {
    success: true,
    output: {
      status: res.status,
      statusText: res.statusText,
      data: responseData,
      headers: Object.fromEntries(res.headers.entries()),
    },
  };
};

// ─── Gemini Summarize ───
export const executeGeminiSummarize: NodeExecutor = async (config, input) => {
  const { GoogleGenAI } = await import("@google/genai");
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

  const prompt = config.prompt as string || "Summarize the following data concisely:";
  const inputText = typeof input === "string" ? input : JSON.stringify(input, null, 2);

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `${prompt}\n\n${inputText}`,
  });

  const summary = response.text || "";

  return { success: true, output: { summary, tokensUsed: summary.length } };
};

// ─── Gemini Transform ───
export const executeGeminiTransform: NodeExecutor = async (config, input) => {
  const { GoogleGenAI } = await import("@google/genai");
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

  const instruction = config.instruction as string || "Transform the following data:";
  const outputFormat = config.outputFormat as string || "text";
  const inputText = typeof input === "string" ? input : JSON.stringify(input, null, 2);

  const formatInstruction = outputFormat === "json"
    ? "Respond ONLY with valid JSON."
    : outputFormat === "markdown"
    ? "Respond in Markdown format."
    : "";

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `${instruction}\n${formatInstruction}\n\nInput:\n${inputText}`,
  });

  let result: unknown = response.text || "";
  if (outputFormat === "json") {
    try {
      result = JSON.parse(result as string);
    } catch {
      // Keep as string if not valid JSON
    }
  }

  return { success: true, output: { result, format: outputFormat } };
};

// ─── Condition (If/Else) ───
export const executeCondition: NodeExecutor = async (config, input) => {
  const variable = config.variable as string;
  const operator = config.operator as string;
  const compareValue = config.value as string;

  // Resolve the variable — could be a direct value or a dot-path
  let resolvedValue: unknown;
  if (variable?.startsWith("{{") && variable?.endsWith("}}")) {
    // It's a variable reference like {{step.nodeId.output.field}}
    const path = variable.slice(2, -2).trim();
    resolvedValue = getNestedValue(input, path);
  } else {
    resolvedValue = variable;
  }

  let conditionMet = false;
  switch (operator) {
    case "equals":
      conditionMet = String(resolvedValue) === String(compareValue);
      break;
    case "not_equals":
      conditionMet = String(resolvedValue) !== String(compareValue);
      break;
    case "greater_than":
      conditionMet = Number(resolvedValue) > Number(compareValue);
      break;
    case "less_than":
      conditionMet = Number(resolvedValue) < Number(compareValue);
      break;
    case "contains":
      conditionMet = String(resolvedValue).includes(String(compareValue));
      break;
    case "exists":
      conditionMet = resolvedValue != null && resolvedValue !== "";
      break;
    default:
      conditionMet = false;
  }

  return {
    success: true,
    output: {
      conditionMet,
      resolvedValue,
      operator,
      compareValue,
      branch: conditionMet ? "true" : "false",
    },
  };
};

// ─── Delay ───
export const executeDelay: NodeExecutor = async (config) => {
  const delayMs = Number(config.delayMs) || 1000;
  await new Promise((resolve) => setTimeout(resolve, delayMs));
  return { success: true, output: { delayed: true, durationMs: delayMs } };
};

// ─── Data Transform ───
export const executeDataTransform: NodeExecutor = async (config, input) => {
  const mappings = config.mappings as Record<string, string>;
  if (!mappings || typeof mappings !== "object") {
    return { success: true, output: input };
  }

  const result: Record<string, unknown> = {};
  for (const [key, valueTemplate] of Object.entries(mappings)) {
    result[key] = interpolateField(String(valueTemplate), input);
  }

  return { success: true, output: result };
};

// ─── Helpers ───

function interpolateField(template: string, input: Record<string, unknown>): string {
  if (!template) return template;
  return template.replace(/\{\{([^}]+)\}\}/g, (_, path: string) => {
    const value = getNestedValue(input, path.trim());
    return value !== undefined ? String(value) : `{{${path}}}`;
  });
}

function getNestedValue(obj: unknown, path: string): unknown {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

// ─── Executor Registry ───
export const EXECUTOR_REGISTRY: Record<string, NodeExecutor> = {
  action_gmail_send: executeGmailSend,
  action_telegram_msg: executeTelegramSend,
  action_discord_msg: executeDiscordSend,
  action_slack_msg: executeSlackSend,
  action_http_request: executeHttpRequest,
  action_gemini_summarize: executeGeminiSummarize,
  action_gemini_transform: executeGeminiTransform,
  logic_condition: executeCondition,
  logic_delay: executeDelay,
  logic_transform: executeDataTransform,
};
