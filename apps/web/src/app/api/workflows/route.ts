import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@synapse/shared";
import { z } from "zod";

const createWorkflowSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  naturalLanguagePrompt: z.string().optional(),
  nodes: z.array(z.unknown()).optional(),
  edges: z.array(z.unknown()).optional(),
  dagDefinition: z.unknown().optional(),
});

// GET /api/workflows — List user's workflows
export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const workflows = await prisma.workflow.findMany({
      where: { userId: session.userId, isTemplate: false },
      select: {
        id: true,
        name: true,
        description: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { runs: true } },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ success: true, data: workflows });
  } catch (error) {
    console.error("List workflows error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/workflows — Create a new workflow
export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validation = createWorkflowSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, description, naturalLanguagePrompt, nodes, edges, dagDefinition } = validation.data;

    const workflow = await prisma.workflow.create({
      data: {
        userId: session.userId,
        name,
        description,
        naturalLanguagePrompt,
        nodes: (nodes as any) || [],
        edges: (edges as any) || [],
        dagDefinition: dagDefinition as any,
      },
    });

    // Create webhook endpoint if workflow has a webhook trigger
    const hasWebhookTrigger = nodes?.some(
      (n: any) => n.type === "trigger_webhook" || n.data?.nodeType === "trigger_webhook"
    );

    if (hasWebhookTrigger) {
      const endpoint = await prisma.webhookEndpoint.create({
        data: {
          workflowId: workflow.id,
          userId: session.userId,
        },
      });

      return NextResponse.json({
        success: true,
        data: {
          ...workflow,
          webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/${endpoint.id}`,
        },
      });
    }

    return NextResponse.json({ success: true, data: workflow });
  } catch (error) {
    console.error("Create workflow error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
