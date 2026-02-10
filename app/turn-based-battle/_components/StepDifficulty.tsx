import { useShallow } from "zustand/react/shallow";
import { cn } from "../../_utils";
import { CLASS_DATA, DIFFICULTY_CONFIG, SKILL_TYPE_LABELS } from "../_constants";
import { useBattleStore } from "../_store/useBattleStore";
import type { Difficulty } from "../_types";

const DIFFICULTY_STYLES: Record<Difficulty, { border: string; bg: string }> = {
  easy: { border: "border-green-500/50", bg: "bg-green-500/10" },
  normal: { border: "border-yellow-500/50", bg: "bg-yellow-500/10" },
  hard: { border: "border-red-500/50", bg: "bg-red-500/10" },
};

export default function StepDifficulty() {
  const { difficulty, playerName, playerClass, selectedSkills } = useBattleStore(
    useShallow((s) => ({
      difficulty: s.difficulty,
      playerName: s.playerName,
      playerClass: s.playerClass,
      selectedSkills: s.selectedSkills,
    })),
  );
  const setDifficulty = useBattleStore((s) => s.setDifficulty);
  const setStep = useBattleStore((s) => s.setStep);
  const startBattle = useBattleStore((s) => s.startBattle);

  if (!playerClass) return null;
  const classInfo = CLASS_DATA[playerClass];

  return (
    <div className="w-full max-w-lg space-y-6">
      <div>
        <label className="mb-3 block text-sm font-medium text-slate-300">
          AI 난이도
        </label>
        <div className="grid grid-cols-3 gap-3">
          {(Object.keys(DIFFICULTY_CONFIG) as Difficulty[]).map((d) => {
            const config = DIFFICULTY_CONFIG[d];
            const styles = DIFFICULTY_STYLES[d];
            const selected = difficulty === d;

            return (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={cn(
                  "rounded-xl border-2 p-4 text-center transition-all",
                  selected
                    ? `${styles.border} ${styles.bg} ring-2 ${styles.border.replace("border", "ring")}`
                    : "border-slate-700 bg-slate-800/50 hover:border-slate-600",
                )}
              >
                <div className="text-sm font-bold text-white">
                  {config.label}
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  {config.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
        <h3 className="mb-3 text-sm font-medium text-slate-300">
          최종 확인
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{classInfo.emoji}</span>
            <div>
              <div className="font-bold text-white">{playerName}</div>
              <div className="text-xs text-slate-400">{classInfo.label}</div>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2 text-center text-xs">
            {(["HP", "MP", "ATK", "DEF", "SPD"] as const).map((stat) => (
              <div key={stat} className="rounded-md bg-slate-900 px-2 py-1.5">
                <div className="text-slate-500">{stat}</div>
                <div className="font-bold text-white">
                  {classInfo.stats[stat]}
                </div>
              </div>
            ))}
          </div>

          <div>
            <div className="mb-1 text-xs text-slate-500">선택 스킬</div>
            <div className="flex flex-wrap gap-1.5">
              {selectedSkills.map((skill) => (
                <span
                  key={skill.id}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs",
                    SKILL_TYPE_LABELS[skill.type].color,
                    "bg-slate-900",
                  )}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setStep(2)}
          className="rounded-lg border border-slate-600 px-6 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800"
        >
          ← 이전
        </button>
        <button
          onClick={startBattle}
          className="rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-500/25 transition-all hover:from-violet-500 hover:to-purple-500 hover:shadow-violet-500/40"
        >
          ⚔️ 전투 시작
        </button>
      </div>
    </div>
  );
}
