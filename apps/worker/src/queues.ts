import { createRedisConnection } from "@synapse/shared";
import { Queue } from "bullmq";

const connection = createRedisConnection();

export const triggerQueue = new Queue("synapse-triggers", { connection: connection as any });
export const stepQueue = new Queue("synapse-steps", { connection: connection as any });

// Job data types
export interface TriggerJobData {
  workflowId: string;
  runId: string;
  triggerData: Record<string, unknown>;
}

export interface StepJobData {
  workflowId: string;
  runId: string;
  stepExecutionId: string;
  nodeId: string;
  nodeType: string;
  nodeLabel: string;
  config: Record<string, unknown>;
  input: Record<string, unknown>;
  dagDefinition: {
    nodes: Array<{ id: string; type: string; data: Record<string, unknown> }>;
    edges: Array<{ source: string; target: string; sourceHandle?: string }>;
  };
  userId: string;
}
