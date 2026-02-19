import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@synapse/shared";
import { parseWorkflowFromNL } from "@/lib/ai/workflow-parser";
import { z } from "zod";

const parseSchema = z.object({
  prompt: z.string().min(10, "Please describe your workflow in more detail"),
  lang: z.enum(["en", "tr"]).optional().default("en"),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validation = parseSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    // Get user's active integrations for context
    const integrations = await prisma.integration.findMany({
      where: { userId: session.userId, isActive: true },
      select: { provider: true, label: true },
    });

    const activeIntegrations = integrations.map(
      (i) => `${i.provider}: ${i.label}`
    );

    const dag = await parseWorkflowFromNL(validation.data.prompt, activeIntegrations, validation.data.lang);

    // Convert to React Flow format with positions
    const VERTICAL_SPACING = 150;
    const nodes = dag.nodes.map((node, index) => ({
      id: node.id,
      type: node.type,
      position: { x: 300, y: 100 + index * VERTICAL_SPACING },
      data: {
        label: node.label,
        nodeType: node.type,
        config: node.config || {},
      },
    }));

    const edges = dag.edges.map((edge, index) => ({
      id: `edge_${index}`,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle || null,
      targetHandle: edge.targetHandle || null,
      animated: true,
    }));

    return NextResponse.json({
      success: true,
      data: {
        nodes,
        edges,
        dagDefinition: dag,
        metadata: dag.metadata,
      },
    });
  } catch (error) {
    console.error("Parse workflow error:", error);
    const message = error instanceof Error ? error.message : "Failed to parse workflow";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
