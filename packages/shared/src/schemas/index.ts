// ─── Synapse Zod Validation Schemas ───

import { z } from "zod";
import { NodeType, NodeCategory } from "../constants";

// ─── Auth Schemas ───

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// ─── Integration Credential Schemas ───

export const gmailCredentialsSchema = z.object({
  clientId: z.string().min(1, "Client ID is required"),
  clientSecret: z.string().min(1, "Client Secret is required"),
  refreshToken: z.string().optional(),
  accessToken: z.string().optional(),
  tokenExpiry: z.number().optional(),
});

export const telegramCredentialsSchema = z.object({
  botToken: z.string().min(1, "Bot Token is required"),
  chatId: z.string().min(1, "Chat ID is required"),
});

export const discordCredentialsSchema = z.object({
  webhookUrl: z.string().url("Invalid webhook URL"),
  botToken: z.string().optional(),
});

export const slackCredentialsSchema = z.object({
  webhookUrl: z.string().url("Invalid webhook URL"),
  botToken: z.string().optional(),
});

export const webhookConfigSchema = z.object({
  method: z.enum(["GET", "POST", "PUT"]).optional().default("POST"),
});

// ─── Integration Save Schema ───

export const saveIntegrationSchema = z.object({
  provider: z.nativeEnum({
    GMAIL: "GMAIL" as const,
    DISCORD: "DISCORD" as const,
    TELEGRAM: "TELEGRAM" as const,
    SLACK: "SLACK" as const,
    WEBHOOK: "WEBHOOK" as const,
  }),
  label: z.string().min(1, "Label is required").max(50),
  credentials: z.record(z.unknown()),
});

// ─── Workflow DAG Schemas ───

export const dagNodeSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(NodeType),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  data: z.object({
    label: z.string(),
    config: z.record(z.unknown()).optional(),
    nodeType: z.nativeEnum(NodeType),
  }),
});

export const dagEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  sourceHandle: z.string().optional(),
  targetHandle: z.string().optional(),
});

export const dagDefinitionSchema = z.object({
  nodes: z.array(dagNodeSchema),
  edges: z.array(dagEdgeSchema),
  metadata: z.object({
    name: z.string(),
    description: z.string().optional(),
  }),
});

// ─── AI Output Schema (what Gemini must produce) ───

export const aiWorkflowOutputSchema = z.object({
  nodes: z.array(
    z.object({
      id: z.string(),
      type: z.nativeEnum(NodeType),
      label: z.string(),
      config: z.record(z.unknown()).optional(),
    })
  ),
  edges: z.array(
    z.object({
      source: z.string(),
      target: z.string(),
      sourceHandle: z.string().optional(),
      targetHandle: z.string().optional(),
    })
  ),
  metadata: z.object({
    name: z.string(),
    description: z.string(),
  }),
});

// ─── Workflow Create/Update Schema ───

export const createWorkflowSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  naturalLanguagePrompt: z.string().optional(),
  nodes: z.array(z.unknown()).optional(),
  edges: z.array(z.unknown()).optional(),
  dagDefinition: z.unknown().optional(),
});

export const updateWorkflowSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  nodes: z.array(z.unknown()).optional(),
  edges: z.array(z.unknown()).optional(),
  dagDefinition: z.unknown().optional(),
  isActive: z.boolean().optional(),
});

// ─── Workflow Parse Request ───

export const parseWorkflowSchema = z.object({
  prompt: z.string().min(10, "Prompt too short — describe your workflow in more detail"),
});

export const refineWorkflowSchema = z.object({
  currentDag: dagDefinitionSchema,
  refinementPrompt: z.string().min(5, "Refinement prompt too short"),
});

// ─── Type Exports ───

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type GmailCredentials = z.infer<typeof gmailCredentialsSchema>;
export type TelegramCredentials = z.infer<typeof telegramCredentialsSchema>;
export type DiscordCredentials = z.infer<typeof discordCredentialsSchema>;
export type SlackCredentials = z.infer<typeof slackCredentialsSchema>;
export type DagNode = z.infer<typeof dagNodeSchema>;
export type DagEdge = z.infer<typeof dagEdgeSchema>;
export type DagDefinition = z.infer<typeof dagDefinitionSchema>;
export type AIWorkflowOutput = z.infer<typeof aiWorkflowOutputSchema>;
export type CreateWorkflowInput = z.infer<typeof createWorkflowSchema>;
export type UpdateWorkflowInput = z.infer<typeof updateWorkflowSchema>;
export type ParseWorkflowInput = z.infer<typeof parseWorkflowSchema>;
export type RefineWorkflowInput = z.infer<typeof refineWorkflowSchema>;
