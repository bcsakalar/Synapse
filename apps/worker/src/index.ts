import { Worker, Job } from "bullmq";
import { createRedisConnection, db } from "@synapse/shared";
import { type TriggerJobData, type StepJobData, stepQueue } from "./queues";
import { EXECUTOR_REGISTRY } from "./executors";

const connection = createRedisConnection();

console.log("⚡ Synapse Worker starting...");

// ─── Trigger Worker ───
// Processes incoming webhook triggers and spawns step execution jobs
const triggerWorker = new Worker<TriggerJobData>(
  "synapse-triggers",
  async (job: Job<TriggerJobData>) => {
    const { workflowId, runId, triggerData } = job.data;
    console.log(`🚀 Processing trigger for workflow ${workflowId}, run ${runId}`);

    try {
      // Update run status to RUNNING
      await db.workflowRun.update({
        where: { id: runId },
        data: { status: "RUNNING", startedAt: new Date() },
      });

      // Get the workflow DAG
      const workflow = await db.workflow.findUnique({
        where: { id: workflowId },
        include: { user: { select: { id: true } } },
      });

      if (!workflow || !workflow.dagDefinition) {
        throw new Error("Workflow or DAG not found");
      }

      const dag = workflow.dagDefinition as {
        nodes: Array<{ id: string; type: string; data: Record<string, unknown> }>;
        edges: Array<{ source: string; target: string; sourceHandle?: string }>;
      };

      // Find trigger node(s) — nodes with no incoming edges
      const nodesWithIncoming = new Set(dag.edges.map((e) => e.target));
      const triggerNodes = dag.nodes.filter((n) => !nodesWithIncoming.has(n.id));

      if (triggerNodes.length === 0) {
        throw new Error("No trigger nodes found in DAG");
      }

      // Create step execution records for ALL nodes
      const stepExecs = await Promise.all(
        dag.nodes.map((node) =>
          db.stepExecution.create({
            data: {
              runId,
              nodeId: node.id,
              nodeType: node.type,
              nodeName: (node.data?.label as string) || node.type,
              status: "PENDING",
            },
          })
        )
      );

      const stepExecMap = new Map(stepExecs.map((s) => [s.nodeId, s]));

      // The trigger node output is the triggerData
      for (const triggerNode of triggerNodes) {
        const stepExec = stepExecMap.get(triggerNode.id);
        if (!stepExec) continue;

        // Mark trigger step as completed immediately (its output = triggerData)
        await db.stepExecution.update({
          where: { id: stepExec.id },
          data: {
            status: "SUCCESS",
            input: triggerData as any,
            output: triggerData as any,
            startedAt: new Date(),
            completedAt: new Date(),
            durationMs: 0,
          },
        });

        // Publish status event via Redis
        await publishStepStatus(runId, triggerNode.id, "SUCCESS");

        // Find next nodes and enqueue them
        const nextEdges = dag.edges.filter((e) => e.source === triggerNode.id);
        for (const edge of nextEdges) {
          const nextNode = dag.nodes.find((n) => n.id === edge.target);
          const nextStepExec = stepExecMap.get(edge.target);
          if (!nextNode || !nextStepExec) continue;

          await stepQueue.add(`step:${nextStepExec.id}`, {
            workflowId,
            runId,
            stepExecutionId: nextStepExec.id,
            nodeId: nextNode.id,
            nodeType: nextNode.type,
            nodeLabel: (nextNode.data?.label as string) || nextNode.type,
            config: (nextNode.data?.config as Record<string, unknown>) || {},
            input: triggerData,
            dagDefinition: dag,
            userId: workflow.user.id,
          } satisfies StepJobData);
        }
      }
    } catch (error) {
      console.error(`❌ Trigger processing failed:`, error);
      await db.workflowRun.update({
        where: { id: runId },
        data: {
          status: "FAILED",
          completedAt: new Date(),
          error: error instanceof Error ? error.message : "Unknown error",
        },
      });
      throw error;
    }
  },
  {
    connection: connection as any,
    concurrency: 5,
  }
);

// ─── Step Worker ───
// Executes individual workflow steps
const stepWorker = new Worker<StepJobData>(
  "synapse-steps",
  async (job: Job<StepJobData>) => {
    const {
      workflowId, runId, stepExecutionId,
      nodeId, nodeType, nodeLabel, config, input,
      dagDefinition, userId,
    } = job.data;

    console.log(`⚙️  Executing step ${nodeLabel} (${nodeType}) for run ${runId}`);

    const startTime = Date.now();

    try {
      // Mark step as RUNNING
      await db.stepExecution.update({
        where: { id: stepExecutionId },
        data: { status: "RUNNING", startedAt: new Date(), input: input as any },
      });
      await publishStepStatus(runId, nodeId, "RUNNING");

      // Get the executor
      const executor = EXECUTOR_REGISTRY[nodeType];
      if (!executor) {
        throw new Error(`No executor found for node type: ${nodeType}`);
      }

      // Build the accumulated input from previous steps
      const accumulatedInput = await buildStepInput(runId, nodeId, dagDefinition, input);

      // Execute the node
      const result = await executor(config, accumulatedInput, { userId });

      const durationMs = Date.now() - startTime;

      if (!result.success) {
        throw new Error(result.error || "Execution failed");
      }

      // Mark step as SUCCESS
      await db.stepExecution.update({
        where: { id: stepExecutionId },
        data: {
          status: "SUCCESS",
          output: result.output as any,
          completedAt: new Date(),
          durationMs,
        },
      });
      await publishStepStatus(runId, nodeId, "SUCCESS");

      // Determine next steps
      const nextEdges = dagDefinition.edges.filter((e) => e.source === nodeId);

      // Handle condition branching
      if (nodeType === "logic_condition") {
        const branch = result.output.branch as string; // "true" or "false"
        const branchEdges = nextEdges.filter((e) => {
          // Filter based on sourceHandle matching branch
          return e.sourceHandle === branch || e.sourceHandle === `${branch}-handle`;
        });

        for (const edge of branchEdges) {
          await enqueueNextStep(edge.target, dagDefinition, workflowId, runId, result.output, userId);
        }

        // Mark skipped branches
        const skippedEdges = nextEdges.filter((e) => {
          return e.sourceHandle !== branch && e.sourceHandle !== `${branch}-handle`;
        });
        for (const edge of skippedEdges) {
          await skipBranch(edge.target, runId, dagDefinition);
        }
      } else {
        // Normal nodes: enqueue all downstream
        for (const edge of nextEdges) {
          await enqueueNextStep(edge.target, dagDefinition, workflowId, runId, result.output, userId);
        }
      }

      // Check if all steps are done
      await checkRunCompletion(runId);
    } catch (error) {
      const durationMs = Date.now() - startTime;
      const errorMsg = error instanceof Error ? error.message : "Unknown error";

      console.error(`❌ Step ${nodeLabel} failed:`, errorMsg);

      await db.stepExecution.update({
        where: { id: stepExecutionId },
        data: {
          status: "FAILED",
          error: errorMsg,
          completedAt: new Date(),
          durationMs,
        },
      });
      await publishStepStatus(runId, nodeId, "FAILED");

      // Mark the run as FAILED
      await db.workflowRun.update({
        where: { id: runId },
        data: {
          status: "FAILED",
          completedAt: new Date(),
          error: `Step "${nodeLabel}" failed: ${errorMsg}`,
        },
      });

      throw error;
    }
  },
  {
    connection: connection as any,
    concurrency: 10,
    limiter: { max: 50, duration: 60000 }, // 50 jobs per minute max
  }
);

// ─── Helper Functions ───

async function buildStepInput(
  runId: string,
  nodeId: string,
  dag: StepJobData["dagDefinition"],
  directInput: Record<string, unknown>
): Promise<Record<string, unknown>> {
  // Get all completed steps' outputs for this run
  const completedSteps = await db.stepExecution.findMany({
    where: { runId, status: "SUCCESS" },
    select: { nodeId: true, output: true },
  });

  const stepOutputs: Record<string, unknown> = {};
  for (const step of completedSteps) {
    stepOutputs[step.nodeId] = step.output;
  }

  // Build a context that includes all previous step outputs
  return {
    ...directInput,
    step: stepOutputs,
    __trigger: directInput,
  };
}

async function enqueueNextStep(
  targetNodeId: string,
  dag: StepJobData["dagDefinition"],
  workflowId: string,
  runId: string,
  currentOutput: Record<string, unknown>,
  userId: string
) {
  const targetNode = dag.nodes.find((n) => n.id === targetNodeId);
  if (!targetNode) return;

  // Check if all upstream nodes have completed
  const incomingEdges = dag.edges.filter((e) => e.target === targetNodeId);
  if (incomingEdges.length > 1) {
    const upstreamNodeIds = incomingEdges.map((e) => e.source);
    const upstreamSteps = await db.stepExecution.findMany({
      where: { runId, nodeId: { in: upstreamNodeIds } },
    });
    const allDone = upstreamSteps.every((s) => s.status === "SUCCESS" || s.status === "SKIPPED" || s.status === "FAILED");
    if (!allDone) return; // Wait for all upstream to finish
  }

  const stepExec = await db.stepExecution.findFirst({
    where: { runId, nodeId: targetNodeId },
  });
  if (!stepExec || stepExec.status !== "PENDING") return;

  await stepQueue.add(`step:${stepExec.id}`, {
    workflowId,
    runId,
    stepExecutionId: stepExec.id,
    nodeId: targetNode.id,
    nodeType: targetNode.type,
    nodeLabel: (targetNode.data?.label as string) || targetNode.type,
    config: (targetNode.data?.config as Record<string, unknown>) || {},
    input: currentOutput,
    dagDefinition: dag,
    userId,
  } satisfies StepJobData);
}

async function skipBranch(
  nodeId: string,
  runId: string,
  dag: StepJobData["dagDefinition"]
) {
  const stepExec = await db.stepExecution.findFirst({
    where: { runId, nodeId, status: "PENDING" },
  });
  if (!stepExec) return;

  await db.stepExecution.update({
    where: { id: stepExec.id },
    data: { status: "SKIPPED", completedAt: new Date() },
  });
  await publishStepStatus(runId, nodeId, "SKIPPED");

  // Skip all downstream nodes of this branch
  const nextEdges = dag.edges.filter((e) => e.source === nodeId);
  for (const edge of nextEdges) {
    await skipBranch(edge.target, runId, dag);
  }
}

async function checkRunCompletion(runId: string) {
  const steps = await db.stepExecution.findMany({
    where: { runId },
    select: { status: true },
  });

  const allDone = steps.every((s) => s.status !== "PENDING" && s.status !== "RUNNING");
  if (!allDone) return;

  const hasFailed = steps.some((s) => s.status === "FAILED");
  const allSkippedOrSuccess = steps.every((s) => s.status === "SUCCESS" || s.status === "SKIPPED");

  await db.workflowRun.update({
    where: { id: runId },
    data: {
      status: hasFailed ? "PARTIAL" : "COMPLETED",
      completedAt: new Date(),
    },
  });

  console.log(`✅ Run ${runId} completed — ${hasFailed ? "PARTIAL" : "COMPLETED"}`);
}

async function publishStepStatus(runId: string, nodeId: string, status: string) {
  const redis = createRedisConnection();
  try {
    await redis.publish(
      `synapse:run:${runId}`,
      JSON.stringify({ runId, nodeId, status, timestamp: Date.now() })
    );
  } catch {
    // Non-critical
  } finally {
    redis.disconnect();
  }
}

// ─── Graceful Shutdown ───
const shutdown = async () => {
  console.log("🛑 Shutting down workers...");
  await triggerWorker.close();
  await stepWorker.close();
  process.exit(0);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

// ─── Worker event logging ───
triggerWorker.on("completed", (job) => {
  console.log(`✅ Trigger job ${job.id} completed`);
});
triggerWorker.on("failed", (job, err) => {
  console.error(`❌ Trigger job ${job?.id} failed:`, err.message);
});

stepWorker.on("completed", (job) => {
  console.log(`✅ Step job ${job.id} completed`);
});
stepWorker.on("failed", (job, err) => {
  console.error(`❌ Step job ${job?.id} failed:`, err.message);
});

console.log("⚡ Synapse Worker ready — listening for jobs");
