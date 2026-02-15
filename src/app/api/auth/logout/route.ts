import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/", request.url));

  // Clear auth cookies
  response.cookies.delete("access_token");
  response.cookies.delete("refresh_token");

  return response;
}
