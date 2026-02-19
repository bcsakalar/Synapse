import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@synapse/shared";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const logs = await db.webhookLog.findMany({
      where: {
        endpoint: {
          workflow: { userId: user.userId },
        },
      },
      include: {
        endpoint: {
          select: {
            id: true,
            workflow: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json({ success: true, data: logs });
  } catch (error) {
    console.error("Webhook logs error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch webhook logs" },
      { status: 500 }
    );
  }
}
