// ─── Synapse AI Workflow Parser ───
// Uses @google/genai to convert natural language to structured DAG

import { GoogleGenAI } from "@google/genai";
import { NodeType } from "@synapse/shared";

const NODE_TYPE_VALUES = Object.values(NodeType);

// JSON Schema for Gemini structured output
const WORKFLOW_DAG_SCHEMA = {
  type: "object" as const,
  properties: {
    nodes: {
      type: "array" as const,
      items: {
        type: "object" as const,
        properties: {
          id: { type: "string" as const, description: "Unique node ID like 'node_1', 'node_2'" },
          type: {
            type: "string" as const,
            enum: NODE_TYPE_VALUES,
            description: "The node type from the available types",
          },
          label: { type: "string" as const, description: "Human-readable label for this step" },
          config: {
            type: "object" as const,
            description: "Node-specific configuration based on type",
            properties: {},
          },
        },
        required: ["id", "type", "label"],
      },
    },
    edges: {
      type: "array" as const,
      items: {
        type: "object" as const,
        properties: {
          source: { type: "string" as const, description: "Source node ID" },
          target: { type: "string" as const, description: "Target node ID" },
          sourceHandle: { type: "string" as const, description: "Output handle (for condition nodes: 'true' or 'false')" },
          targetHandle: { type: "string" as const, description: "Input handle" },
        },
        required: ["source", "target"],
      },
    },
    metadata: {
      type: "object" as const,
      properties: {
        name: { type: "string" as const, description: "Short workflow name" },
        description: { type: "string" as const, description: "Brief description of what the workflow does" },
      },
      required: ["name", "description"],
    },
  },
  required: ["nodes", "edges", "metadata"],
};

function getSystemPrompt(activeIntegrations: string[], lang: string = "en"): string {
  const base = `You are a workflow automation expert. Your job is to convert natural language descriptions into structured workflow DAG (Directed Acyclic Graph) definitions.

AVAILABLE NODE TYPES:
- trigger_webhook: Webhook trigger — starts when an HTTP request is received
- trigger_cron: Cron/schedule trigger — starts on a schedule (config: cronExpression)
- action_gmail_send: Send email via Gmail (config: to, subject, body, integrationId)
- action_telegram_msg: Send Telegram message (config: message, integrationId)
- action_discord_msg: Send Discord message (config: content, username, integrationId)
- action_slack_msg: Send Slack message (config: text, integrationId)
- action_http_request: Make an HTTP request (config: url, method, headers, body)
- action_gemini_summarize: AI summarization (config: prompt, maxTokens)
- action_gemini_transform: AI data transformation (config: instruction, outputFormat)
- logic_condition: If/else branching (config: variable, operator, value). Has TWO outputs: "true" and "false"
- logic_delay: Wait for a duration (config: delayMs)
- logic_transform: Data field mapping (config: mappings)

USER'S ACTIVE INTEGRATIONS: ${activeIntegrations.length > 0 ? activeIntegrations.join(", ") : "None configured yet"}

RULES:
1. Every workflow MUST start with exactly one trigger node (trigger_webhook or trigger_cron)
2. Nodes are connected sequentially via edges (source -> target)
3. Use {{step.NODE_ID.output.FIELD}} syntax for variable references between nodes
4. For condition nodes, create edges with sourceHandle "true" and "false" for both branches
5. Node IDs should be "node_1", "node_2", etc.
6. Keep configs practical and meaningful
7. If the user mentions Iyzico, payment, form submission, or any external service, use trigger_webhook
8. If the user mentions AI, summarize, transform, or process data, use the appropriate Gemini node
9. Generate realistic config values (email addresses, message templates with variables, etc.)

OUTPUT: Return a valid JSON object matching the exact schema provided.`;

  if (lang === "tr") {
    return base + `\n\nIMPORTANT: The user speaks Turkish. Generate node labels, workflow name, and workflow description in Turkish. Keep node type identifiers and config keys in English, but make all human-readable text (labels, name, description) in Turkish.`;
  }
  return base;
}

interface ParsedWorkflow {
  nodes: Array<{
    id: string;
    type: string;
    label: string;
    config?: Record<string, unknown>;
  }>;
  edges: Array<{
    source: string;
    target: string;
    sourceHandle?: string;
    targetHandle?: string;
  }>;
  metadata: {
    name: string;
    description: string;
  };
}

export async function parseWorkflowFromNL(
  prompt: string,
  activeIntegrations: string[],
  lang: string = "en"
): Promise<ParsedWorkflow> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");

  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Create a workflow automation for: "${prompt}"`,
    config: {
      systemInstruction: getSystemPrompt(activeIntegrations, lang),
      responseMimeType: "application/json",
      responseSchema: WORKFLOW_DAG_SCHEMA,
      temperature: 0.4,
    },
  });

  const text = response.text;
  if (!text) throw new Error("Empty response from Gemini");

  const parsed = JSON.parse(text) as ParsedWorkflow;

  // Validate basic structure
  if (!parsed.nodes || !Array.isArray(parsed.nodes) || parsed.nodes.length === 0) {
    throw new Error("AI returned an invalid workflow structure (no nodes)");
  }
  if (!parsed.edges || !Array.isArray(parsed.edges)) {
    throw new Error("AI returned an invalid workflow structure (no edges)");
  }
  if (!parsed.metadata?.name) {
    throw new Error("AI returned an invalid workflow structure (no metadata)");
  }

  return parsed;
}

export async function refineWorkflowWithAI(
  currentDag: ParsedWorkflow,
  refinementPrompt: string,
  activeIntegrations: string[],
  lang: string = "en"
): Promise<ParsedWorkflow> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");

  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Here is the current workflow DAG:
\`\`\`json
${JSON.stringify(currentDag, null, 2)}
\`\`\`

User's refinement request: "${refinementPrompt}"

Modify the workflow according to the user's request. Keep existing nodes/edges that aren't affected by the change. Return the complete updated DAG.`,
    config: {
      systemInstruction: getSystemPrompt(activeIntegrations, lang),
      responseMimeType: "application/json",
      responseSchema: WORKFLOW_DAG_SCHEMA,
      temperature: 0.3,
    },
  });

  const text = response.text;
  if (!text) throw new Error("Empty response from Gemini");

  return JSON.parse(text) as ParsedWorkflow;
}
