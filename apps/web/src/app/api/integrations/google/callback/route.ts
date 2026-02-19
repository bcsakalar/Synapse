import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { prisma, encryptCredentials } from "@synapse/shared";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const stateParam = url.searchParams.get("state");
    const error = url.searchParams.get("error");

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3099";

    if (error) {
      return NextResponse.redirect(
        `${appUrl}/dashboard/integrations?error=${encodeURIComponent("Google authorization was denied")}`
      );
    }

    if (!code || !stateParam) {
      return NextResponse.redirect(
        `${appUrl}/dashboard/integrations?error=${encodeURIComponent("Invalid callback parameters")}`
      );
    }

    // Decode state
    let state: {
      userId: string;
      clientId: string;
      clientSecret: string;
      label: string;
    };

    try {
      state = JSON.parse(Buffer.from(stateParam, "base64url").toString("utf8"));
    } catch {
      return NextResponse.redirect(
        `${appUrl}/dashboard/integrations?error=${encodeURIComponent("Invalid state parameter")}`
      );
    }

    const redirectUri = `${appUrl}/api/integrations/google/callback`;
    const oauth2Client = new google.auth.OAuth2(
      state.clientId,
      state.clientSecret,
      redirectUri
    );

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get user email for display
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();
    const email = userInfo.data.email || "Unknown";

    // Encrypt all credentials together
    const credentials = {
      clientId: state.clientId,
      clientSecret: state.clientSecret,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      tokenExpiry: tokens.expiry_date,
    };

    const encrypted = encryptCredentials(credentials);

    // Save or update integration
    await prisma.integration.upsert({
      where: {
        userId_provider_label: {
          userId: state.userId,
          provider: "GMAIL",
          label: state.label,
        },
      },
      update: {
        encryptedCredentials: encrypted.ciphertext,
        iv: encrypted.iv,
        authTag: encrypted.authTag,
        metadata: { email, name: userInfo.data.name },
        isActive: true,
      },
      create: {
        userId: state.userId,
        provider: "GMAIL",
        label: state.label,
        encryptedCredentials: encrypted.ciphertext,
        iv: encrypted.iv,
        authTag: encrypted.authTag,
        metadata: { email, name: userInfo.data.name },
        isActive: true,
      },
    });

    return NextResponse.redirect(
      `${appUrl}/dashboard/integrations?success=${encodeURIComponent(`Gmail connected as ${email}`)}`
    );
  } catch (error) {
    console.error("Google callback error:", error);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3099";
    return NextResponse.redirect(
      `${appUrl}/dashboard/integrations?error=${encodeURIComponent("Failed to connect Gmail. Please try again.")}`
    );
  }
}
