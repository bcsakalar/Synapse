import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@synapse/shared";

// DELETE /api/integrations/[id]
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

    const integration = await prisma.integration.findFirst({
      where: { id, userId: session.userId },
    });

    if (!integration) {
      return NextResponse.json({ success: false, error: "Integration not found" }, { status: 404 });
    }

    await prisma.integration.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Integration disconnected" });
  } catch (error) {
    console.error("Delete integration error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
