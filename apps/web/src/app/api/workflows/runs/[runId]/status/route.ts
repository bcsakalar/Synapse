import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@synapse/shared";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ runId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { runId } = await params;

    const steps = await db.stepExecution.findMany({
      where: {
        runId,
        run: { workflow: { userId: user.userId } },
      },
      select: {
        nodeId: true,
        status: true,
        durationMs: true,
      },
    });

    return NextResponse.json({ success: true, data: steps });
  } catch (error) {
    console.error("Run status error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch run status" },
      { status: 500 }
    );
  }
}
