"use client";

import { useShallow } from "zustand/shallow";
import { STATUS_EMOJI } from "../_constants";
import { useGameStore } from "../_store/useGameStore";
import { formatTime } from "../_utils/boardUtils";
import { cn } from "@/app/_utils";

export default function StatusBar() {
  const { settings, flagCount, gameStatus, elapsedTime, resetGame } =
    useGameStore(
      useShallow((s) => ({
        settings: s.settings,
        flagCount: s.flagCount,
        gameStatus: s.gameStatus,
        elapsedTime: s.elapsedTime,
        resetGame: s.resetGame,
      })),
    );

  const remainingMines = settings.mines - flagCount;

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-lg px-4 py-2",
        "bg-gray-300 dark:bg-gray-700",
        "border border-gray-400 dark:border-gray-600",
      )}
    >
      <div
        className={cn(
          "min-w-16 rounded bg-gray-900 px-3 py-1 text-center font-mono text-lg font-bold",
          "text-red-500",
        )}
      >
        {remainingMines}
      </div>

      <button
        className="cursor-pointer text-2xl transition-transform hover:scale-110 active:scale-95"
        onClick={resetGame}
      >
        {STATUS_EMOJI[gameStatus]}
      </button>

      <div
        className={cn(
          "min-w-16 rounded bg-gray-900 px-3 py-1 text-center font-mono text-lg font-bold",
          "text-red-500",
        )}
      >
        {formatTime(elapsedTime)}
        {settings.timeLimit !== null && (
          <span className="text-xs text-gray-400">
            {" "}
            / {formatTime(settings.timeLimit)}
          </span>
        )}
      </div>
    </div>
  );
}
