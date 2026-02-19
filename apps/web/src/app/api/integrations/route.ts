import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma, encryptCredentials } from "@synapse/shared";
import { z } from "zod";

const saveIntegrationSchema = z.object({
  provider: z.enum(["GMAIL", "DISCORD", "TELEGRAM", "SLACK", "WEBHOOK"]),
  label: z.string().min(1).max(50),
  credentials: z.record(z.unknown()),
  metadata: z.record(z.unknown()).optional(),
});

// GET /api/integrations — List user's integrations
export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const integrations = await prisma.integration.findMany({
      where: { userId: session.userId },
      select: {
        id: true,
        provider: true,
        label: true,
        metadata: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: integrations });
  } catch (error) {
    console.error("List integrations error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/integrations — Save a new integration with encrypted credentials
export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validation = saveIntegrationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { provider, label, credentials, metadata } = validation.data;

    // Validate provider-specific credentials
    if (provider === "TELEGRAM") {
      if (!credentials.botToken || !credentials.chatId) {
        return NextResponse.json(
          { success: false, error: "Bot Token and Chat ID are required for Telegram" },
          { status: 400 }
        );
      }
      // Validate by calling Telegram API
      try {
        const res = await fetch(`https://api.telegram.org/bot${credentials.botToken}/getMe`);
        if (!res.ok) throw new Error("Invalid bot token");
        const data = await res.json();
        validation.data.metadata = {
          ...metadata,
          botName: data.result?.first_name,
          botUsername: data.result?.username,
        };
      } catch {
        return NextResponse.json(
          { success: false, error: "Invalid Telegram Bot Token — could not verify" },
          { status: 400 }
        );
      }
    }

    if (provider === "DISCORD") {
      if (!credentials.webhookUrl) {
        return NextResponse.json(
          { success: false, error: "Webhook URL is required for Discord" },
          { status: 400 }
        );
      }
    }

    if (provider === "SLACK") {
      if (!credentials.webhookUrl) {
        return NextResponse.json(
          { success: false, error: "Webhook URL is required for Slack" },
          { status: 400 }
        );
      }
    }

    // Encrypt credentials
    const encrypted = encryptCredentials(credentials as Record<string, unknown>);

    const integration = await prisma.integration.create({
      data: {
        userId: session.userId,
        provider,
        label,
        encryptedCredentials: encrypted.ciphertext,
        iv: encrypted.iv,
        authTag: encrypted.authTag,
        metadata: ((validation.data.metadata as Record<string, unknown>) || metadata || null) as any,
        isActive: true,
      },
      select: {
        id: true,
        provider: true,
        label: true,
        metadata: true,
        isActive: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, data: integration });
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return NextResponse.json(
        { success: false, error: "An integration with this label already exists for this provider" },
        { status: 409 }
      );
    }
    console.error("Save integration error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
