// ─── Synapse Node Type Registry ───
// Defines all available node types for the workflow DAG

export enum NodeCategory {
  TRIGGER = "trigger",
  ACTION = "action",
  AI = "ai",
  LOGIC = "logic",
}

export enum NodeType {
  // Triggers
  TRIGGER_WEBHOOK = "trigger_webhook",
  TRIGGER_CRON = "trigger_cron",

  // Actions
  ACTION_GMAIL_SEND = "action_gmail_send",
  ACTION_TELEGRAM_MSG = "action_telegram_msg",
  ACTION_DISCORD_MSG = "action_discord_msg",
  ACTION_SLACK_MSG = "action_slack_msg",
  ACTION_HTTP_REQUEST = "action_http_request",

  // AI
  ACTION_GEMINI_SUMMARIZE = "action_gemini_summarize",
  ACTION_GEMINI_TRANSFORM = "action_gemini_transform",

  // Logic
  LOGIC_CONDITION = "logic_condition",
  LOGIC_DELAY = "logic_delay",
  LOGIC_TRANSFORM = "logic_transform",
}

export interface NodeTypeMetadata {
  type: NodeType;
  label: string;
  description: string;
  category: NodeCategory;
  icon: string; // Lucide icon name
  color: string; // Tailwind color class
  glowColor: string; // For status glow
  inputs: number; // Number of input handles
  outputs: number; // Number of output handles
  configFields: ConfigField[];
}

export interface ConfigField {
  key: string;
  label: string;
  type: "text" | "textarea" | "select" | "number" | "json" | "variable";
  placeholder?: string;
  required: boolean;
  options?: { label: string; value: string }[];
  description?: string;
}

// ─── Full Node Registry ───

export const NODE_REGISTRY: Record<NodeType, NodeTypeMetadata> = {
  // ─── Triggers ───
  [NodeType.TRIGGER_WEBHOOK]: {
    type: NodeType.TRIGGER_WEBHOOK,
    label: "Webhook Trigger",
    description: "Starts workflow when an HTTP request is received",
    category: NodeCategory.TRIGGER,
    icon: "Webhook",
    color: "emerald",
    glowColor: "rgba(16, 185, 129, 0.6)",
    inputs: 0,
    outputs: 1,
    configFields: [
      {
        key: "method",
        label: "HTTP Method",
        type: "select",
        required: false,
        options: [
          { label: "POST", value: "POST" },
          { label: "GET", value: "GET" },
          { label: "PUT", value: "PUT" },
        ],
      },
    ],
  },

  [NodeType.TRIGGER_CRON]: {
    type: NodeType.TRIGGER_CRON,
    label: "Schedule (Cron)",
    description: "Starts workflow on a schedule",
    category: NodeCategory.TRIGGER,
    icon: "Clock",
    color: "emerald",
    glowColor: "rgba(16, 185, 129, 0.6)",
    inputs: 0,
    outputs: 1,
    configFields: [
      {
        key: "cronExpression",
        label: "Cron Expression",
        type: "text",
        placeholder: "*/5 * * * *",
        required: true,
        description: "Standard cron expression (e.g., '0 9 * * 1-5' for weekdays at 9am)",
      },
    ],
  },

  // ─── Actions ───
  [NodeType.ACTION_GMAIL_SEND]: {
    type: NodeType.ACTION_GMAIL_SEND,
    label: "Send Email (Gmail)",
    description: "Send an email using Gmail API",
    category: NodeCategory.ACTION,
    icon: "Mail",
    color: "red",
    glowColor: "rgba(239, 68, 68, 0.6)",
    inputs: 1,
    outputs: 1,
    configFields: [
      { key: "to", label: "To", type: "text", placeholder: "recipient@example.com", required: true },
      { key: "subject", label: "Subject", type: "text", placeholder: "Email subject...", required: true },
      { key: "body", label: "Body", type: "textarea", placeholder: "Email body (supports {{variables}})...", required: true },
      { key: "integrationId", label: "Gmail Account", type: "select", required: true },
    ],
  },

  [NodeType.ACTION_TELEGRAM_MSG]: {
    type: NodeType.ACTION_TELEGRAM_MSG,
    label: "Send Telegram Message",
    description: "Send a message to a Telegram chat",
    category: NodeCategory.ACTION,
    icon: "Send",
    color: "sky",
    glowColor: "rgba(14, 165, 233, 0.6)",
    inputs: 1,
    outputs: 1,
    configFields: [
      { key: "message", label: "Message", type: "textarea", placeholder: "Message text (supports {{variables}})...", required: true },
      { key: "integrationId", label: "Telegram Bot", type: "select", required: true },
    ],
  },

  [NodeType.ACTION_DISCORD_MSG]: {
    type: NodeType.ACTION_DISCORD_MSG,
    label: "Send Discord Message",
    description: "Send a message via Discord webhook",
    category: NodeCategory.ACTION,
    icon: "MessageCircle",
    color: "indigo",
    glowColor: "rgba(99, 102, 241, 0.6)",
    inputs: 1,
    outputs: 1,
    configFields: [
      { key: "content", label: "Message", type: "textarea", placeholder: "Discord message...", required: true },
      { key: "username", label: "Bot Name (optional)", type: "text", required: false },
      { key: "integrationId", label: "Discord Webhook", type: "select", required: true },
    ],
  },

  [NodeType.ACTION_SLACK_MSG]: {
    type: NodeType.ACTION_SLACK_MSG,
    label: "Send Slack Message",
    description: "Send a message to a Slack channel",
    category: NodeCategory.ACTION,
    icon: "Hash",
    color: "green",
    glowColor: "rgba(34, 197, 94, 0.6)",
    inputs: 1,
    outputs: 1,
    configFields: [
      { key: "text", label: "Message", type: "textarea", placeholder: "Slack message...", required: true },
      { key: "integrationId", label: "Slack Webhook", type: "select", required: true },
    ],
  },

  [NodeType.ACTION_HTTP_REQUEST]: {
    type: NodeType.ACTION_HTTP_REQUEST,
    label: "HTTP Request",
    description: "Make an HTTP request to any URL",
    category: NodeCategory.ACTION,
    icon: "Globe",
    color: "orange",
    glowColor: "rgba(249, 115, 22, 0.6)",
    inputs: 1,
    outputs: 1,
    configFields: [
      { key: "url", label: "URL", type: "text", placeholder: "https://api.example.com/data", required: true },
      {
        key: "method",
        label: "Method",
        type: "select",
        required: true,
        options: [
          { label: "GET", value: "GET" },
          { label: "POST", value: "POST" },
          { label: "PUT", value: "PUT" },
          { label: "DELETE", value: "DELETE" },
          { label: "PATCH", value: "PATCH" },
        ],
      },
      { key: "headers", label: "Headers (JSON)", type: "json", required: false },
      { key: "body", label: "Body (JSON)", type: "json", required: false },
    ],
  },

  // ─── AI ───
  [NodeType.ACTION_GEMINI_SUMMARIZE]: {
    type: NodeType.ACTION_GEMINI_SUMMARIZE,
    label: "AI Summarize",
    description: "Summarize input data using Gemini AI",
    category: NodeCategory.AI,
    icon: "Sparkles",
    color: "purple",
    glowColor: "rgba(168, 85, 247, 0.6)",
    inputs: 1,
    outputs: 1,
    configFields: [
      { key: "prompt", label: "Summarization Prompt", type: "textarea", placeholder: "Summarize the following data concisely...", required: false },
      { key: "maxTokens", label: "Max Tokens", type: "number", required: false },
    ],
  },

  [NodeType.ACTION_GEMINI_TRANSFORM]: {
    type: NodeType.ACTION_GEMINI_TRANSFORM,
    label: "AI Transform",
    description: "Transform/process data using Gemini AI with custom instructions",
    category: NodeCategory.AI,
    icon: "Wand2",
    color: "purple",
    glowColor: "rgba(168, 85, 247, 0.6)",
    inputs: 1,
    outputs: 1,
    configFields: [
      { key: "instruction", label: "Instruction", type: "textarea", placeholder: "Transform this data into...", required: true },
      { key: "outputFormat", label: "Output Format", type: "select", required: false, options: [
        { label: "Plain Text", value: "text" },
        { label: "JSON", value: "json" },
        { label: "Markdown", value: "markdown" },
      ]},
    ],
  },

  // ─── Logic ───
  [NodeType.LOGIC_CONDITION]: {
    type: NodeType.LOGIC_CONDITION,
    label: "Condition (If/Else)",
    description: "Branch workflow based on a condition",
    category: NodeCategory.LOGIC,
    icon: "GitBranch",
    color: "amber",
    glowColor: "rgba(245, 158, 11, 0.6)",
    inputs: 1,
    outputs: 2, // true + false branches
    configFields: [
      { key: "variable", label: "Variable", type: "variable", placeholder: "{{step.nodeId.output.field}}", required: true },
      {
        key: "operator",
        label: "Operator",
        type: "select",
        required: true,
        options: [
          { label: "Equals", value: "equals" },
          { label: "Not Equals", value: "not_equals" },
          { label: "Greater Than", value: "greater_than" },
          { label: "Less Than", value: "less_than" },
          { label: "Contains", value: "contains" },
          { label: "Exists (not null)", value: "exists" },
        ],
      },
      { key: "value", label: "Comparison Value", type: "text", placeholder: "Value to compare against", required: false },
    ],
  },

  [NodeType.LOGIC_DELAY]: {
    type: NodeType.LOGIC_DELAY,
    label: "Delay",
    description: "Wait for a specified duration before continuing",
    category: NodeCategory.LOGIC,
    icon: "Timer",
    color: "amber",
    glowColor: "rgba(245, 158, 11, 0.6)",
    inputs: 1,
    outputs: 1,
    configFields: [
      { key: "delayMs", label: "Delay (ms)", type: "number", placeholder: "5000", required: true },
    ],
  },

  [NodeType.LOGIC_TRANSFORM]: {
    type: NodeType.LOGIC_TRANSFORM,
    label: "Data Transform",
    description: "Map and transform data fields between steps",
    category: NodeCategory.LOGIC,
    icon: "Shuffle",
    color: "amber",
    glowColor: "rgba(245, 158, 11, 0.6)",
    inputs: 1,
    outputs: 1,
    configFields: [
      { key: "mappings", label: "Field Mappings (JSON)", type: "json", placeholder: '{"outputField": "{{step.X.output.Y}}"}', required: true },
    ],
  },
};
