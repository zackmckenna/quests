import Link from "next/link";

// Prerendered static page (no edge runtime)
const SAMPLE_QUESTS = [
  {
    id: "downtown-discovery",
    title: "Downtown Discovery",
    description: "Explore the heart of the city through hidden gems and local stories.",
    stepCount: 8,
  },
  {
    id: "park-adventure",
    title: "Park Adventure",
    description: "A nature walk with puzzles and photo challenges.",
    stepCount: 5,
  },
];

export default function HomePage() {
  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Quests IRL
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Real-world adventures await
          </p>
        </div>
        <Link
          href="/api/auth/login"
          className="rounded-full bg-fuchsia-600 px-4 py-2 text-sm font-medium text-white hover:bg-fuchsia-700 transition-colors"
        >
          Sign In
        </Link>
      </header>

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
                <div className="h-20 w-20 flex-shrink-0 rounded-lg bg-gradient-to-br from-fuchsia-400 to-fuchsia-600 flex items-center justify-center">
                  <span className="text-2xl">🗺️</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                    {quest.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                    {quest.description}
                  </p>
                  <p className="text-xs text-fuchsia-600 dark:text-fuchsia-400 mt-2">
                    {quest.stepCount} steps
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
