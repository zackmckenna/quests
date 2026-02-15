// OpenAuth client integration
// Connects to auth.secretlevellabs.com for authentication

import { createClient } from "@openauthjs/openauth/client";
import { object, string } from "valibot";

// Define the user subject schema (must match OpenAuth issuer)
export const subjects = {
  user: object({
    id: string(),
    email: string(),
  }),
};

// Type for authenticated user
export type User = {
  id: string;
  email: string;
};

// Default client ID for the quests app
export const CLIENT_ID = "quests";

// Create OpenAuth client
export function createAuthClient(issuerUrl: string, clientId: string = CLIENT_ID) {
  return createClient({
    issuer: issuerUrl,
    clientID: clientId,
  });
}

// Verify an access token and extract user info
export async function verifyToken(
  issuerUrl: string,
  accessToken: string,
  clientId: string = CLIENT_ID
): Promise<User | null> {
  try {
    const client = createAuthClient(issuerUrl, clientId);
    const verified = await client.verify(subjects, accessToken);

    if (verified.err) {
      console.error("[Auth] Token verification failed:", verified.err);
      return null;
    }

    if (verified.subject.type !== "user") {
      console.error("[Auth] Unexpected subject type:", verified.subject.type);
      return null;
    }

    return verified.subject.properties as User;
  } catch (error) {
    console.error("[Auth] Verification error:", error);
    return null;
  }
}

// Get authorization URL for login
export function getAuthUrl(
  issuerUrl: string,
  provider: "google" | "github" | "code",
  redirectUri: string,
  clientId: string
): string {
  const params = new URLSearchParams({
    provider,
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
  });

  return `${issuerUrl}/authorize?${params.toString()}`;
}

// Exchange authorization code for tokens
export async function exchangeCode(
  issuerUrl: string,
  code: string,
  redirectUri: string,
  clientId: string
): Promise<{ accessToken: string; refreshToken?: string } | null> {
  try {
    const response = await fetch(`${issuerUrl}/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
      }),
    });

    if (!response.ok) {
      console.error("[Auth] Token exchange failed:", await response.text());
      return null;
    }

    const data = await response.json();
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
    };
  } catch (error) {
    console.error("[Auth] Token exchange error:", error);
    return null;
  }
}
