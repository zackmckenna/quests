"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

// Mock quest data - same as quest detail page
const QUESTS: Record<
  string,
  {
    id: string;
    title: string;
    steps: {
      id: string;
      type: string;
      title: string;
      content: string;
      hint?: string;
    }[];
  }
> = {
  "downtown-discovery": {
    id: "downtown-discovery",
    title: "Downtown Discovery",
    steps: [
      {
        id: "step-1",
        type: "story",
        title: "The Beginning",
        content:
          "Welcome, adventurer! You're about to embark on a journey through the heart of downtown. Each step will reveal hidden stories and forgotten corners of our city.\n\nYour first task is simple: take a deep breath and look around. The adventure begins where you stand.",
      },
      {
        id: "step-2",
        type: "location",
        title: "First Landmark",
        content:
          "Make your way to the old clock tower in the town square. This 100-year-old landmark has witnessed countless moments of history.\n\nStand beneath its shadow and look up. What time does it show?",
        hint: "The clock tower is usually visible from most downtown streets. Look for the tallest structure with a pointed top.",
      },
      {
        id: "step-3",
        type: "clue",
        title: "The Hidden Message",
        content:
          "On the base of the clock tower, there's a bronze plaque. The year it was built holds a secret.\n\nAdd up all the digits of that year. What number do you get?",
        hint: "Most downtown landmarks were built between 1890 and 1930.",
      },
      {
        id: "step-4",
        type: "photo",
        title: "Capture the Moment",
        content:
          "Find the most interesting architectural detail on any building within sight of the clock tower.\n\nTake a photo that captures something most people walk past without noticing.",
        hint: "Look up! Often the best details are above eye level - ornate cornices, old signs, or decorative stonework.",
      },
      {
        id: "step-5",
        type: "interact",
        title: "Local Secret",
        content:
          "Ask a local shop owner or passerby: \"What's your favorite hidden spot in downtown?\"\n\nTheir answer might surprise you and could become your next adventure.",
        hint: "Coffee shops and bookstores often have the friendliest folks who know the area well.",
      },
      {
        id: "step-6",
        type: "location",
        title: "Second Landmark",
        content:
          "Head to the oldest restaurant in downtown. Every city has one - a place that's been serving the community for generations.\n\nWhat year did it open?",
        hint: "Look for places with vintage signs or \"Established\" dates on their windows.",
      },
      {
        id: "step-7",
        type: "clue",
        title: "Final Puzzle",
        content:
          "You've gathered numbers throughout this quest. The clock tower year, the restaurant founding year...\n\nSubtract the smaller from the larger. This is your quest completion code.",
        hint: "Review your notes from previous steps.",
      },
      {
        id: "step-8",
        type: "story",
        title: "The End",
        content:
          "Congratulations, explorer! You've completed the Downtown Discovery quest.\n\nYou've walked the same streets that generations before you have walked, but now you see them differently. The clock tower isn't just a landmark - it's a witness to history. The old restaurant isn't just a place to eat - it's a keeper of stories.\n\nCarry these discoveries with you, and remember: adventure is everywhere, if you know how to look.",
      },
    ],
  },
  "park-adventure": {
    id: "park-adventure",
    title: "Park Adventure",
    steps: [
      {
        id: "step-1",
        type: "story",
        title: "Welcome to the Park",
        content:
          "Nature awaits! This adventure will guide you through the park's hidden wonders. Take your time, breathe deeply, and let the journey unfold.",
      },
      {
        id: "step-2",
        type: "location",
        title: "The Old Oak",
        content:
          "Find the oldest, largest tree in the park. How many people would it take to wrap their arms around its trunk?",
        hint: "Old oaks are usually found near the center or along the oldest paths.",
      },
      {
        id: "step-3",
        type: "photo",
        title: "Wildlife Spotting",
        content:
          "Capture a photo of any wildlife - birds, squirrels, insects, or even interesting plants. The smaller creatures often have the biggest stories.",
        hint: "Sit still for a few minutes. Wildlife tends to appear when you stop moving.",
      },
      {
        id: "step-4",
        type: "clue",
        title: "Nature's Riddle",
        content:
          "I have bark but never bite, I have rings but never marry, I drink from below and breathe from above. What am I?",
        hint: "You're probably standing near or looking at the answer.",
      },
      {
        id: "step-5",
        type: "story",
        title: "Journey Complete",
        content:
          "You've completed the Park Adventure! Nature has a way of showing us that the smallest things often matter the most. Return to this park often - it changes with every season, every day, every hour.\n\nUntil next time, adventurer.",
      },
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

export default function PlayPage() {
  const params = useParams();
  const router = useRouter();
  const questId = params.id as string;
  const quest = QUESTS[questId];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  if (!quest) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Quest not found</p>
        <Link href="/" className="text-quest-600 hover:text-quest-700 mt-2 block">
          Back to Quests
        </Link>
      </div>
    );
  }

  const currentStep = quest.steps[currentStepIndex];
  const isLastStep = currentStepIndex === quest.steps.length - 1;
  const isFirstStep = currentStepIndex === 0;

  const completeStep = () => {
    setCompletedSteps((prev) => new Set([...prev, currentStep.id]));
    setShowHint(false);

    if (isLastStep) {
      // Quest complete!
      router.push(`/quest/${questId}?completed=true`);
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const previousStep = () => {
    if (!isFirstStep) {
      setCurrentStepIndex((prev) => prev - 1);
      setShowHint(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between py-2">
        <Link
          href={`/quest/${questId}`}
          className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400"
        >
          ✕ Exit
        </Link>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {currentStepIndex + 1} / {quest.steps.length}
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-quest-500 transition-all duration-300"
          style={{
            width: `${((currentStepIndex + 1) / quest.steps.length) * 100}%`,
          }}
        />
      </div>

      {/* Step content */}
      <div className="flex-1 py-8 space-y-6">
        {/* Step type badge */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">{STEP_ICONS[currentStep.type]}</span>
          <span className="text-sm font-medium text-quest-600 dark:text-quest-400 uppercase tracking-wide">
            {currentStep.type}
          </span>
        </div>

        {/* Step title */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {currentStep.title}
        </h1>

        {/* Step content */}
        <div className="prose dark:prose-invert prose-sm max-w-none">
          {currentStep.content.split("\n\n").map((paragraph, i) => (
            <p key={i} className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Hint */}
        {currentStep.hint && (
          <div className="pt-4">
            {showHint ? (
              <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  <span className="font-semibold">Hint:</span> {currentStep.hint}
                </p>
              </div>
            ) : (
              <button
                onClick={() => setShowHint(true)}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                💡 Need a hint?
              </button>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="pb-6 space-y-3">
        <button
          onClick={completeStep}
          className="w-full rounded-xl bg-quest-600 px-6 py-4 text-center text-lg font-semibold text-white hover:bg-quest-700 transition-colors"
        >
          {isLastStep ? "Complete Quest" : "Continue"}
        </button>

        {!isFirstStep && (
          <button
            onClick={previousStep}
            className="w-full text-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ← Previous step
          </button>
        )}
      </div>
    </div>
  );
}
