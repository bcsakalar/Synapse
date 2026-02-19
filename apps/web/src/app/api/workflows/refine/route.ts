import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@synapse/shared";
import { refineWorkflowWithAI } from "@/lib/ai/workflow-parser";
import { z } from "zod";

const refineSchema = z.object({
  currentDag: z.object({
    nodes: z.array(z.unknown()),
    edges: z.array(z.unknown()),
    metadata: z.object({
      name: z.string(),
      description: z.string(),
    }),
  }),
  refinementPrompt: z.string().min(5, "Refinement prompt too short"),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validation = refineSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const integrations = await prisma.integration.findMany({
      where: { userId: session.userId, isActive: true },
      select: { provider: true, label: true },
    });

    const activeIntegrations = integrations.map((i) => `${i.provider}: ${i.label}`);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dag = await refineWorkflowWithAI(
      validation.data.currentDag as any,
      validation.data.refinementPrompt,
      activeIntegrations
    );

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
      data: { nodes, edges, dagDefinition: dag, metadata: dag.metadata },
    });
  } catch (error) {
    console.error("Refine workflow error:", error);
    const message = error instanceof Error ? error.message : "Failed to refine workflow";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
