// ─── Synapse Shared Type Definitions ───

export interface JWTPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ─── Integration Types ───

export type IntegrationProviderType =
  | "GMAIL"
  | "DISCORD"
  | "TELEGRAM"
  | "SLACK"
  | "WEBHOOK";

export interface IntegrationDisplay {
  id: string;
  provider: IntegrationProviderType;
  label: string;
  metadata: Record<string, unknown> | null;
  isActive: boolean;
  createdAt: string;
}

// ─── Workflow Execution ───

export interface WorkflowExecutionContext {
  runId: string;
  workflowId: string;
  userId: string;
  dagDefinition: unknown;
  stepOutputs: Record<string, unknown>; // nodeId -> output data
}

export interface StepJobData {
  runId: string;
  workflowId: string;
  userId: string;
  nodeId: string;
  nodeType: string;
  nodeName: string;
  config: Record<string, unknown>;
  input: unknown;
  dagDefinition: unknown;
}

export interface TriggerJobData {
  workflowId: string;
  userId: string;
  endpointId?: string;
  triggerPayload: unknown;
}

// ─── Socket Events ───

export interface StepStatusEvent {
  runId: string;
  nodeId: string;
  status: "PENDING" | "RUNNING" | "SUCCESS" | "FAILED" | "SKIPPED";
  output?: unknown;
  error?: string;
  durationMs?: number;
}

export interface WebhookReceivedEvent {
  endpointId: string;
  logId: string;
  method: string;
  body: unknown;
  timestamp: string;
}

// ─── Variable Interpolation ───

export interface VariableReference {
  fullMatch: string;   // "{{step.node1.output.summary}}"
  nodeId: string;      // "node1"
  path: string;        // "output.summary"
}
