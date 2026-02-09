"use client";

import { GearSix } from "@phosphor-icons/react";
import GameBoard from "./_components/GameBoard";
import SettingsForm from "./_components/SettingsForm";
import { useGameStore } from "./_store/useGameStore";

export default function MinesweeperPage() {
  const gameStatus = useGameStore((s) => s.gameStatus);
  const goBackToSettings = useGameStore((s) => s.goBackToSettings);

  const isSettingsView = gameStatus === "idle";

  return (
    <main className="flex min-h-screen flex-col items-center py-8">
      {isSettingsView ? (
        <SettingsForm />
      ) : (
        <div className="flex flex-col items-center gap-4 px-4">
          <div className="flex w-full items-center">
            <button
              className="cursor-pointer rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
              onClick={goBackToSettings}
              title="Settings"
            >
              <GearSix size={24} />
            </button>
            <h1 className="flex-1 text-center text-xl font-bold text-slate-100">
              Minesweeper
            </h1>
            <div className="w-10" />
          </div>
          <GameBoard />
        </div>
      )}
    </main>
  );
}
