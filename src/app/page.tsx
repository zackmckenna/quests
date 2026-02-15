import Link from "next/link";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

// Force edge runtime for Cloudflare Pages
export const runtime = "edge";

// Mock quests for now - will be replaced with database query
const SAMPLE_QUESTS = [
  {
    id: "downtown-discovery",
    title: "Downtown Discovery",
    description:
      "Explore the heart of the city through hidden gems and local stories.",
    stepCount: 8,
    coverImageUrl: null,
  },
  {
    id: "park-adventure",
    title: "Park Adventure",
    description: "A nature walk with puzzles and photo challenges.",
    stepCount: 5,
    coverImageUrl: null,
  },
];

export default async function HomePage() {
  // Check if user is logged in
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const issuerUrl = process.env.AUTH_ISSUER_URL || "";

  let user = null;
  if (accessToken && issuerUrl) {
    user = await verifyToken(issuerUrl, accessToken);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Quests IRL
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Real-world adventures await
          </p>
        </div>
        {user ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {user.email.split("@")[0]}
            </span>
            <Link
              href="/api/auth/logout"
              className="text-sm text-quest-600 hover:text-quest-700"
            >
              Logout
            </Link>
          </div>
        ) : (
          <Link
            href="/api/auth/login"
            className="rounded-full bg-quest-600 px-4 py-2 text-sm font-medium text-white hover:bg-quest-700 transition-colors"
          >
            Sign In
          </Link>
        )}
      </header>

      {/* Quest List */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Available Quests
        </h2>

        <div className="space-y-3">
          {SAMPLE_QUESTS.map((quest) => (
            <Link
              key={quest.id}
              href={`/quest/${quest.id}`}
              className="block rounded-xl bg-white dark:bg-gray-800 p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700"
            >
              <div className="flex gap-4">
                {/* Cover image placeholder */}
                <div className="h-20 w-20 flex-shrink-0 rounded-lg bg-gradient-to-br from-quest-400 to-quest-600 flex items-center justify-center">
                  <span className="text-2xl">🗺️</span>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                    {quest.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                    {quest.description}
                  </p>
                  <p className="text-xs text-quest-600 dark:text-quest-400 mt-2">
                    {quest.stepCount} steps
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Empty state if no quests */}
      {SAMPLE_QUESTS.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No quests available yet.
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Check back soon for new adventures!
          </p>
        </div>
      )}
    </div>
  );
}
