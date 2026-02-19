import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@synapse/shared";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  nodes: z.array(z.unknown()).optional(),
  edges: z.array(z.unknown()).optional(),
  dagDefinition: z.unknown().optional(),
  isActive: z.boolean().optional(),
});

// GET /api/workflows/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const workflow = await prisma.workflow.findFirst({
      where: { id, userId: session.userId },
      include: {
        webhookEndpoints: {
          where: { isActive: true },
          select: { id: true },
        },
        _count: { select: { runs: true } },
      },
    });

    if (!workflow) {
      return NextResponse.json({ success: false, error: "Workflow not found" }, { status: 404 });
    }

    const webhookUrl = workflow.webhookEndpoints[0]
      ? `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/${workflow.webhookEndpoints[0].id}`
      : null;

    return NextResponse.json({
      success: true,
      data: { ...workflow, webhookUrl },
    });
  } catch (error) {
    console.error("Get workflow error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// PUT /api/workflows/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const validation = updateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const existing = await prisma.workflow.findFirst({
      where: { id, userId: session.userId },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: "Workflow not found" }, { status: 404 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {};
    const { name, description, nodes, edges, dagDefinition, isActive } = validation.data;

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (nodes !== undefined) updateData.nodes = nodes;
    if (edges !== undefined) updateData.edges = edges;
    if (dagDefinition !== undefined) updateData.dagDefinition = dagDefinition;
    if (isActive !== undefined) updateData.isActive = isActive;

    const workflow = await prisma.workflow.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: workflow });
  } catch (error) {
    console.error("Update workflow error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/workflows/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const workflow = await prisma.workflow.findFirst({
      where: { id, userId: session.userId },
    });

    if (!workflow) {
      return NextResponse.json({ success: false, error: "Workflow not found" }, { status: 404 });
    }

    await prisma.workflow.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Workflow deleted" });
  } catch (error) {
    console.error("Delete workflow error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
