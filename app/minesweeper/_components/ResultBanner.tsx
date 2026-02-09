"use client";

import { useGameStore } from "../_store/useGameStore";
import { formatTime } from "../_utils/boardUtils";
import { cn } from "@/app/_utils";

export default function ResultBanner() {
  const gameStatus = useGameStore((s) => s.gameStatus);
  const elapsedTime = useGameStore((s) => s.elapsedTime);
  const loseReason = useGameStore((s) => s.loseReason);
  const resetGame = useGameStore((s) => s.resetGame);

  if (gameStatus !== "won" && gameStatus !== "lost") return null;

  const isWon = gameStatus === "won";
  const isTimeout = loseReason === "timeout";

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className={cn(
          "flex flex-col items-center gap-4 rounded-2xl p-8 shadow-2xl",
          "bg-white dark:bg-gray-800",
        )}
      >
        <span className="text-5xl">
          {isWon ? "🎉" : isTimeout ? "⏰" : "💥"}
        </span>
        <h2
          className={cn(
            "text-2xl font-bold",
            isWon
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400",
          )}
        >
          {isWon ? "You Win!" : isTimeout ? "Time's Up!" : "Game Over"}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Time: {formatTime(elapsedTime)}
        </p>
        <button
          className={cn(
            "rounded-lg px-6 py-2 font-semibold text-white transition-colors",
            "bg-red-500 hover:bg-red-600",
            "dark:bg-red-600 dark:hover:bg-red-700",
          )}
          onClick={resetGame}
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
