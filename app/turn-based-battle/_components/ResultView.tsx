import { useShallow } from "zustand/react/shallow";
import { useBattleStore } from "../_store/useBattleStore";

export default function ResultView() {
  const { result, player, enemy } = useBattleStore(
    useShallow((s) => ({ result: s.result, player: s.player, enemy: s.enemy })),
  );
  const goToSettings = useBattleStore((s) => s.goToSettings);

  if (!result || !player || !enemy) return null;

  const isVictory = result.winner === "player";

  return (
    <div className="w-full max-w-md space-y-6 text-center">
      <div className="space-y-2">
        <div className="text-6xl">{isVictory ? "🏆" : "💀"}</div>
        <h2 className="text-3xl font-black text-white">
          {isVictory ? "승리!" : "패배..."}
        </h2>
      </div>

      <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6 text-left">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">총 턴 수</span>
            <span className="font-bold text-white">{result.totalTurns}턴</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">{player.name} 남은 HP</span>
            <span className="font-bold text-green-400">
              {result.playerRemainingHP} / {player.maxHP}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">{enemy.name} 남은 HP</span>
            <span className="font-bold text-red-400">
              {result.enemyRemainingHP} / {enemy.maxHP}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={goToSettings}
        className="w-full rounded-lg bg-violet-600 py-3 text-sm font-bold text-white transition-colors hover:bg-violet-500"
      >
        설정으로
      </button>
    </div>
  );
}
