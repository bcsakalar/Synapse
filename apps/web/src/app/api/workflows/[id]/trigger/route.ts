import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db, getRedisConnection } from "@synapse/shared";
import { Queue } from "bullmq";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const workflow = await db.workflow.findFirst({
      where: { id, userId: user.userId },
    });

    if (!workflow) {
      return NextResponse.json({ success: false, error: "Workflow not found" }, { status: 404 });
    }

    if (!workflow.dagDefinition) {
      return NextResponse.json(
        { success: false, error: "Workflow has no DAG definition. Save the workflow first." },
        { status: 400 }
      );
    }

    // Parse optional body as trigger data
    let triggerData: Record<string, unknown> = {};
    try {
      const body = await req.json();
      triggerData = body.triggerData ?? {};
    } catch {
      // No body is fine
    }

    // Create a workflow run
    const run = await db.workflowRun.create({
      data: {
        workflowId: id,
        userId: user.userId,
        status: "PENDING",
        triggerPayload: triggerData as any,
      },
    });

    // Enqueue trigger job
    const connection = getRedisConnection();
    const triggerQueue = new Queue("synapse-triggers", { connection: connection as any });

    await triggerQueue.add(`trigger:${run.id}`, {
      workflowId: id,
      runId: run.id,
      triggerData,
    });

    return NextResponse.json({
      success: true,
      data: { runId: run.id, status: "PENDING" },
    });
  } catch (error) {
    console.error("Manual trigger error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to trigger workflow" },
      { status: 500 }
    );
  }
}
