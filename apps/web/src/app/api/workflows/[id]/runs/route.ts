import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@synapse/shared";

// GET /api/workflows/[id]/runs
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");

    const [runs, total] = await Promise.all([
      prisma.workflowRun.findMany({
        where: { workflowId: id, userId: session.userId },
        select: {
          id: true,
          status: true,
          triggerPayload: true,
          startedAt: true,
          completedAt: true,
          error: true,
          _count: { select: { steps: true } },
        },
        orderBy: { startedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.workflowRun.count({
        where: { workflowId: id, userId: session.userId },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: runs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("List runs error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
