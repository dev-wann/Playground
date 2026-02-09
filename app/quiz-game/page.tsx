"use client";

import GameView from "./_components/GameView";
import ResultView from "./_components/ResultView";
import SettingsForm from "./_components/SettingsForm";
import { useQuizStore } from "./_store/useQuizStore";

export default function QuizGamePage() {
  const phase = useQuizStore((s) => s.phase);

  return (
    <main className="flex min-h-screen flex-col items-center py-8">
      {phase === "settings" && <SettingsForm />}
      {phase === "game" && <GameView />}
      {phase === "result" && <ResultView />}
    </main>
  );
}
