import { NextRequest, NextResponse } from "next/server";
import { exchangeCode, CLIENT_ID } from "@/lib/auth-simple";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const issuerUrl = process.env.AUTH_ISSUER_URL;
  if (!issuerUrl) {
    return NextResponse.json(
      { error: "AUTH_ISSUER_URL not configured" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  // Handle error from OAuth provider
  if (error) {
    console.error("[Auth Callback] OAuth error:", error);
    return NextResponse.redirect(new URL("/?error=auth_failed", request.url));
  }

  // No code means something went wrong
  if (!code) {
    console.error("[Auth Callback] No code received");
    return NextResponse.redirect(new URL("/?error=no_code", request.url));
  }

  // Exchange code for tokens
  const origin = new URL(request.url).origin;
  const redirectUri = `${origin}/api/auth/callback`;

  const tokens = await exchangeCode(issuerUrl, code, redirectUri, CLIENT_ID);

  if (!tokens) {
    console.error("[Auth Callback] Token exchange failed");
    return NextResponse.redirect(
      new URL("/?error=token_exchange_failed", request.url)
    );
  }

  // Set cookies and redirect to home
  const response = NextResponse.redirect(new URL("/", request.url));

  // Set access token cookie (httpOnly for security)
  response.cookies.set("access_token", tokens.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  // Set refresh token if present
  if (tokens.refreshToken) {
    response.cookies.set("refresh_token", tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }

  return response;
}
