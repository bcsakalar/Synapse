import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { google } from "googleapis";
import { z } from "zod";

const authorizeSchema = z.object({
  clientId: z.string().min(1, "Client ID is required"),
  clientSecret: z.string().min(1, "Client Secret is required"),
  label: z.string().min(1).max(50).default("My Gmail"),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validation = authorizeSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { clientId, clientSecret, label } = validation.data;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3099";
    const redirectUri = `${appUrl}/api/integrations/google/callback`;

    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

    // Encode state with userId, clientId, clientSecret, label (encrypted in production)
    const state = Buffer.from(
      JSON.stringify({
        userId: session.userId,
        clientId,
        clientSecret,
        label,
      })
    ).toString("base64url");

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/gmail.send",
        "https://www.googleapis.com/auth/gmail.readonly",
        "https://www.googleapis.com/auth/userinfo.email",
      ],
      state,
    });

    return NextResponse.json({ success: true, data: { authUrl } });
  } catch (error) {
    console.error("Google authorize error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
