import { useShallow } from "zustand/react/shallow";
import { cn } from "../../_utils";
import { CLASS_DATA, MAX_NAME_LENGTH } from "../_constants";
import { useBattleStore } from "../_store/useBattleStore";
import type { CharacterClass } from "../_types";

const CLASS_COLORS: Record<CharacterClass, { border: string; bg: string; ring: string }> = {
  warrior: {
    border: "border-red-500/50",
    bg: "bg-red-500/10",
    ring: "ring-red-500/50",
  },
  mage: {
    border: "border-blue-500/50",
    bg: "bg-blue-500/10",
    ring: "ring-blue-500/50",
  },
  archer: {
    border: "border-green-500/50",
    bg: "bg-green-500/10",
    ring: "ring-green-500/50",
  },
};

export default function StepCharacter() {
  const { playerName, playerClass } = useBattleStore(
    useShallow((s) => ({ playerName: s.playerName, playerClass: s.playerClass })),
  );
  const setPlayerName = useBattleStore((s) => s.setPlayerName);
  const setPlayerClass = useBattleStore((s) => s.setPlayerClass);

  const isValid = playerName.trim().length > 0 && playerName.length <= MAX_NAME_LENGTH && playerClass !== null;

  return (
    <div className="w-full max-w-lg space-y-6">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          캐릭터 이름
        </label>
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          maxLength={MAX_NAME_LENGTH}
          placeholder="이름을 입력하세요"
          className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
        />
        <p className="mt-1 text-xs text-slate-500">
          {playerName.length}/{MAX_NAME_LENGTH}자
        </p>
      </div>

      <div>
        <label className="mb-3 block text-sm font-medium text-slate-300">
          클래스 선택
        </label>
        <div className="grid grid-cols-3 gap-3">
          {(Object.keys(CLASS_DATA) as CharacterClass[]).map((key) => {
            const cls = CLASS_DATA[key];
            const colors = CLASS_COLORS[key];
            const selected = playerClass === key;

            return (
              <button
                key={key}
                onClick={() => setPlayerClass(key)}
                className={cn(
                  "rounded-xl border-2 p-4 text-left transition-all",
                  selected
                    ? `${colors.border} ${colors.bg} ring-2 ${colors.ring}`
                    : "border-slate-700 bg-slate-800/50 hover:border-slate-600",
                )}
              >
                <div className="mb-2 text-center text-3xl">{cls.emoji}</div>
                <div className="mb-2 text-center text-sm font-bold text-white">
                  {cls.label}
                </div>
                <div className="space-y-0.5 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>HP</span>
                    <span className="text-red-400">{cls.stats.HP}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>MP</span>
                    <span className="text-blue-400">{cls.stats.MP}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ATK</span>
                    <span className="text-orange-400">{cls.stats.ATK}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>DEF</span>
                    <span className="text-yellow-400">{cls.stats.DEF}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SPD</span>
                    <span className="text-green-400">{cls.stats.SPD}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <StepNavigation isValid={isValid} />
    </div>
  );
}

function StepNavigation({ isValid }: { isValid: boolean }) {
  const setStep = useBattleStore((s) => s.setStep);

  return (
    <div className="flex justify-end">
      <button
        onClick={() => setStep(2)}
        disabled={!isValid}
        className="rounded-lg bg-violet-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
      >
        다음 →
      </button>
    </div>
  );
}
