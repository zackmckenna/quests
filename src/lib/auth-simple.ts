// Simple auth utilities that work on Cloudflare Edge
// No external dependencies that might have Node.js compatibility issues

export const CLIENT_ID = "quests";

export type User = {
  id: string;
  email: string;
};

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

// Decode JWT payload without verification (for display only)
// Full verification should be done server-side with the issuer
export function decodeToken(token: string): User | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1]));

    // OpenAuth tokens have subject info in properties
    if (payload.properties?.email) {
      return {
        id: payload.properties.id || payload.sub,
        email: payload.properties.email,
      };
    }

    // Fallback for standard JWT
    if (payload.email) {
      return {
        id: payload.sub || payload.id,
        email: payload.email,
      };
    }

    return null;
  } catch {
    return null;
  }
}
