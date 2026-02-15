import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { decodeToken } from "@/lib/auth-simple";

export const runtime = "edge";

// Mock quest data - will be replaced with database query
const QUESTS: Record<
  string,
  {
    id: string;
    title: string;
    description: string;
    steps: { id: string; type: string; title: string }[];
  }
> = {
  "downtown-discovery": {
    id: "downtown-discovery",
    title: "Downtown Discovery",
    description:
      "Explore the heart of the city through hidden gems and local stories. This quest will take you through historic landmarks, secret alleyways, and beloved local spots that tell the story of our downtown.",
    steps: [
      { id: "step-1", type: "story", title: "The Beginning" },
      { id: "step-2", type: "location", title: "First Landmark" },
      { id: "step-3", type: "clue", title: "The Hidden Message" },
      { id: "step-4", type: "photo", title: "Capture the Moment" },
      { id: "step-5", type: "interact", title: "Local Secret" },
      { id: "step-6", type: "location", title: "Second Landmark" },
      { id: "step-7", type: "clue", title: "Final Puzzle" },
      { id: "step-8", type: "story", title: "The End" },
    ],
  },
  "park-adventure": {
    id: "park-adventure",
    title: "Park Adventure",
    description:
      "A nature walk with puzzles and photo challenges. Discover the hidden wonders of the park while solving riddles and capturing beautiful moments.",
    steps: [
      { id: "step-1", type: "story", title: "Welcome to the Park" },
      { id: "step-2", type: "location", title: "The Old Oak" },
      { id: "step-3", type: "photo", title: "Wildlife Spotting" },
      { id: "step-4", type: "clue", title: "Nature's Riddle" },
      { id: "step-5", type: "story", title: "Journey Complete" },
    ],
  },
};

const STEP_ICONS: Record<string, string> = {
  story: "📖",
  location: "📍",
  clue: "🔍",
  photo: "📸",
  interact: "💬",
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function QuestDetailPage({ params }: Props) {
  const { id } = await params;
  const quest = QUESTS[id];

  if (!quest) {
    notFound();
  }

  // Check if user is logged in
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const user = accessToken ? decodeToken(accessToken) : null;

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <svg
          className="w-4 h-4 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Quests
      </Link>

      {/* Quest header */}
      <div className="space-y-4">
        {/* Cover image */}
        <div className="h-48 rounded-2xl bg-gradient-to-br from-quest-400 to-quest-600 flex items-center justify-center">
          <span className="text-6xl">🗺️</span>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {quest.title}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            {quest.description}
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
            <span>📍</span>
            <span>{quest.steps.length} steps</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
            <span>⏱️</span>
            <span>~{Math.ceil(quest.steps.length * 10)} min</span>
          </div>
        </div>
      </div>

      {/* Steps preview */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          What to expect
        </h2>
        <div className="space-y-2">
          {quest.steps.map((step, index) => (
            <div
              key={step.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-quest-100 dark:bg-quest-900 flex items-center justify-center text-sm">
                {STEP_ICONS[step.type] || "📋"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {index + 1}. {step.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {step.type}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Start button */}
      <div className="pt-4">
        {user ? (
          <Link
            href={`/play/${quest.id}`}
            className="block w-full rounded-xl bg-quest-600 px-6 py-4 text-center text-lg font-semibold text-white hover:bg-quest-700 transition-colors"
          >
            Start Quest
          </Link>
        ) : (
          <div className="space-y-3">
            <Link
              href="/api/auth/login"
              className="block w-full rounded-xl bg-quest-600 px-6 py-4 text-center text-lg font-semibold text-white hover:bg-quest-700 transition-colors"
            >
              Sign In to Start
            </Link>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Sign in to track your progress
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
