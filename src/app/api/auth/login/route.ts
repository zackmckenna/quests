import { NextRequest, NextResponse } from "next/server";
import { getAuthUrl, CLIENT_ID } from "@/lib/auth";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const issuerUrl = process.env.AUTH_ISSUER_URL;
  if (!issuerUrl) {
    return NextResponse.json(
      { error: "AUTH_ISSUER_URL not configured" },
      { status: 500 }
    );
  }

  // Get provider from query string (default to google)
  const { searchParams } = new URL(request.url);
  const provider = (searchParams.get("provider") || "google") as
    | "google"
    | "github"
    | "code";

  // Build callback URL
  const origin = new URL(request.url).origin;
  const redirectUri = `${origin}/api/auth/callback`;

  // Redirect to OpenAuth
  const authUrl = getAuthUrl(issuerUrl, provider, redirectUri, CLIENT_ID);

  return NextResponse.redirect(authUrl);
}
