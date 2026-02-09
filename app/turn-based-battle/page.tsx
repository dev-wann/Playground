"use client";

import BattleView from "./_components/BattleView";
import ResultView from "./_components/ResultView";
import SettingsForm from "./_components/SettingsForm";
import { useBattleStore } from "./_store/useBattleStore";

export default function TurnBasedBattlePage() {
  const phase = useBattleStore((s) => s.phase);

  return (
    <main className="flex min-h-screen flex-col items-center py-8 px-4">
      {phase === "settings" && <SettingsForm />}
      {phase === "battle" && <BattleView />}
      {phase === "result" && <ResultView />}
    </main>
  );
}
