// Database client for Quests
// Connects to Turso SQLite database

import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "@/db/schema";

// For edge runtime (Cloudflare), we create a new client per request
// This is the recommended pattern for serverless environments

export function createDb(url: string, authToken: string) {
  const client = createClient({
    url,
    authToken,
  });

  return drizzle(client, { schema });
}

// Helper to get database from environment
export function getDb(env: { TURSO_URL: string; TURSO_TOKEN: string }) {
  return createDb(env.TURSO_URL, env.TURSO_TOKEN);
}

// Re-export schema for convenience
export * from "@/db/schema";
