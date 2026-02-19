import { NextRequest, NextResponse } from "next/server";
import { prisma, createRedisConnection } from "@synapse/shared";
import { Queue } from "bullmq";

// POST/GET /api/webhooks/[endpointId] — Public webhook endpoint
async function handleWebhook(
  req: NextRequest,
  { params }: { params: Promise<{ endpointId: string }> }
) {
  try {
    const { endpointId } = await params;

    const endpoint = await prisma.webhookEndpoint.findUnique({
      where: { id: endpointId },
      include: {
        workflow: {
          select: { id: true, userId: true, isActive: true, dagDefinition: true },
        },
      },
    });

    if (!endpoint || !endpoint.isActive) {
      return NextResponse.json({ error: "Webhook not found" }, { status: 404 });
    }

    if (!endpoint.workflow.isActive) {
      return NextResponse.json({ error: "Workflow is not active" }, { status: 400 });
    }

    // Parse the incoming data
    let body: unknown = null;
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      try {
        body = await req.json();
      } catch {
        body = null;
      }
    } else {
      body = await req.text();
    }

    // Collect headers
    const headers: Record<string, string> = {};
    req.headers.forEach((value, key) => {
      headers[key] = value;
    });

    // Log the webhook call
    const log = await prisma.webhookLog.create({
      data: {
        endpointId,
        method: req.method,
        headers,
        body: body as any,
        ip: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown",
      },
    });

    // Update last called timestamp
    await prisma.webhookEndpoint.update({
      where: { id: endpointId },
      data: { lastCalledAt: new Date() },
    });

    // Enqueue workflow trigger job
    try {
      const connection = createRedisConnection();
      const triggerQueue = new Queue("synapse-triggers", { connection: connection as any });

      // Create a workflow run
      const run = await prisma.workflowRun.create({
        data: {
          workflowId: endpoint.workflow.id,
          userId: endpoint.workflow.userId,
          status: "PENDING",
          triggerPayload: body as any,
        },
      });

      await triggerQueue.add(
        `trigger:${run.id}`,
        {
          workflowId: endpoint.workflow.id,
          runId: run.id,
          triggerData: body,
        },
        {
          attempts: 3,
          backoff: { type: "exponential", delay: 2000 },
        }
      );

      await triggerQueue.close();
      await connection.quit();
    } catch (err) {
      console.error("Failed to enqueue trigger job:", err);
    }

    // Publish real-time webhook event via Redis pub/sub
    try {
      const pubConnection = createRedisConnection();
      await pubConnection.publish(
        `webhook:${endpoint.workflow.userId}`,
        JSON.stringify({
          endpointId,
          logId: log.id,
          method: req.method,
          body,
          timestamp: new Date().toISOString(),
        })
      );
      await pubConnection.quit();
    } catch {
      // Non-critical, don't fail the webhook
    }

    return NextResponse.json({
      success: true,
      message: "Webhook received",
      runId: log.id,
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ endpointId: string }> }) {
  return handleWebhook(req, ctx);
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ endpointId: string }> }) {
  return handleWebhook(req, ctx);
}

export async function PUT(req: NextRequest, ctx: { params: Promise<{ endpointId: string }> }) {
  return handleWebhook(req, ctx);
}
