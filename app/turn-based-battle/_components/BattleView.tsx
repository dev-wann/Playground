import { memo, useCallback, useEffect, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import { cn } from "../../_utils";
import { CLASS_DATA, SKILL_TYPE_LABELS } from "../_constants";
import { useBattleStore } from "../_store/useBattleStore";
import { getEffectiveStat } from "../_utils/battleUtils";
import type { Fighter, BattleLogEntry, FloatingDamage, BattleLogType } from "../_types";

// --- Constants hoisted out of render ---

const LOG_COLORS: Record<BattleLogType, string> = {
  damage: "text-red-400",
  heal: "text-green-400",
  buff: "text-green-300",
  debuff: "text-orange-400",
  poison: "text-purple-400",
  system: "text-slate-400",
  defend: "text-blue-400",
};

// --- Main component ---

export default function BattleView() {
  const { player, enemy, turnNumber, result } = useBattleStore(
    useShallow((s) => ({
      player: s.player,
      enemy: s.enemy,
      turnNumber: s.turnNumber,
      result: s.result,
    })),
  );
  const battleLog = useBattleStore((s) => s.battleLog);
  const floatingDamages = useBattleStore((s) => s.floatingDamages);
  const goToSettings = useBattleStore((s) => s.goToSettings);

  if (!player || !enemy) return null;

  const canAct = !result;

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={goToSettings}
          className="text-sm text-slate-400 transition-colors hover:text-white"
        >
          ← 나가기
        </button>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-violet-500/20 px-3 py-1 text-xs font-bold text-violet-400">
            턴 {turnNumber}
          </span>
          {result && (
            <span className="text-xs text-slate-400">전투 종료</span>
          )}
        </div>
      </div>

      {/* Fighter Panels */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-3">
        <FighterPanel
          fighter={player}
          floatingDamages={floatingDamages.filter((f) => f.target === "player")}
        />
        <div className="flex h-full items-center pt-12">
          <span className="text-xl font-black text-slate-600">VS</span>
        </div>
        <FighterPanel
          fighter={enemy}
          floatingDamages={floatingDamages.filter((f) => f.target === "enemy")}
        />
      </div>

      {/* Action Panel */}
      {canAct && <ActionPanel player={player} />}

      {/* Battle Log */}
      <BattleLog logs={battleLog} />
    </div>
  );
}

// --- Fighter panel ---

const FighterPanel = memo(function FighterPanel({
  fighter,
  floatingDamages,
}: {
  fighter: Fighter;
  floatingDamages: FloatingDamage[];
}) {
  const classInfo = CLASS_DATA[fighter.characterClass];
  const hpPercent = (fighter.currentHP / fighter.maxHP) * 100;
  const mpPercent = (fighter.currentMP / fighter.maxMP) * 100;

  const hpColor =
    hpPercent > 60 ? "bg-green-500" : hpPercent > 30 ? "bg-yellow-500" : "bg-red-500";

  const effATK = getEffectiveStat(fighter, "ATK");
  const effDEF = getEffectiveStat(fighter, "DEF");
  const effSPD = getEffectiveStat(fighter, "SPD");

  return (
    <div className="relative rounded-xl border border-slate-700 bg-slate-800/50 p-4">
      {/* Floating damages */}
      {floatingDamages.map((fd) => (
        <FloatingNumber key={fd.id} data={fd} />
      ))}

      {/* Character info */}
      <div className="mb-3 flex items-center gap-2">
        <span className="text-2xl">{classInfo.emoji}</span>
        <div>
          <div className="text-sm font-bold text-white">{fighter.name}</div>
          <div className="text-xs text-slate-500">{classInfo.label}</div>
        </div>
      </div>

      {/* Status effects */}
      <div className="mb-2 flex flex-wrap gap-1">
        {fighter.buffs.map((b) => (
          <span
            key={b.name}
            className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs text-green-400"
          >
            {b.icon} {b.name} {b.turns}턴
          </span>
        ))}
        {fighter.debuffs.map((d) => (
          <span
            key={d.name}
            className="rounded-full bg-red-500/20 px-2 py-0.5 text-xs text-red-400"
          >
            {d.icon} {d.name} {d.turns}턴
          </span>
        ))}
        {fighter.isDefending && (
          <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-xs text-blue-400">
            🛡️ 방어 중
          </span>
        )}
      </div>

      {/* HP bar */}
      <div className="mb-1">
        <div className="mb-0.5 flex justify-between text-xs">
          <span className="text-slate-400">HP</span>
          <span className="text-white">{fighter.currentHP}/{fighter.maxHP}</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-slate-700">
          <div
            className={cn("h-full rounded-full transition-all duration-500", hpColor)}
            style={{ width: `${Math.max(0, hpPercent)}%` }}
          />
        </div>
      </div>

      {/* MP bar */}
      <div className="mb-3">
        <div className="mb-0.5 flex justify-between text-xs">
          <span className="text-slate-400">MP</span>
          <span className="text-white">{fighter.currentMP}/{fighter.maxMP}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-700">
          <div
            className="h-full rounded-full bg-blue-500 transition-all duration-500"
            style={{ width: `${Math.max(0, mpPercent)}%` }}
          />
        </div>
      </div>

      {/* Effective stats */}
      <div className="grid grid-cols-3 gap-1 text-center text-xs">
        <StatDisplay label="ATK" value={effATK} base={fighter.baseStats.ATK} />
        <StatDisplay label="DEF" value={effDEF} base={fighter.baseStats.DEF} />
        <StatDisplay label="SPD" value={effSPD} base={fighter.baseStats.SPD} />
      </div>
    </div>
  );
});

// --- Floating number with auto-cleanup ---

function FloatingNumber({ data }: { data: FloatingDamage }) {
  const removeFloatingDamage = useCallback(() => {
    useBattleStore.getState().removeFloatingDamage(data.id);
  }, [data.id]);

  useEffect(() => {
    const timer = setTimeout(removeFloatingDamage, 1200);
    return () => clearTimeout(timer);
  }, [removeFloatingDamage]);

  return (
    <div
      className={cn(
        "absolute top-2 left-1/2 z-10 -translate-x-1/2 animate-bounce text-2xl font-black",
        data.type === "damage" ? "text-red-400" : "text-green-400",
      )}
    >
      {data.value}
    </div>
  );
}

// --- Stat display ---

function StatDisplay({ label, value, base }: { label: string; value: number; base: number }) {
  const diff = value - base;
  return (
    <div className="rounded-md bg-slate-900 px-1.5 py-1">
      <div className="text-slate-500">{label}</div>
      <div
        className={cn(
          "font-bold",
          diff > 0 ? "text-green-400" : diff < 0 ? "text-red-400" : "text-white",
        )}
      >
        {value}
        {diff !== 0 && (
          <span className="text-xs">({diff > 0 ? `+${diff}` : diff})</span>
        )}
      </div>
    </div>
  );
}

// --- Action panel ---

function ActionPanel({ player }: { player: Fighter }) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
      <div className="mb-3 text-sm font-medium text-slate-300">행동 선택</div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => useBattleStore.getState().playerAction({ type: "attack" })}
          className="rounded-lg border border-slate-600 bg-slate-900 px-3 py-2.5 text-left transition-colors hover:border-orange-500/50 hover:bg-orange-500/10"
        >
          <div className="text-sm font-medium text-white">⚔️ 기본 공격</div>
          <div className="text-xs text-slate-500">ATK × 1.0</div>
        </button>

        <button
          onClick={() => useBattleStore.getState().playerAction({ type: "defend" })}
          className="rounded-lg border border-slate-600 bg-slate-900 px-3 py-2.5 text-left transition-colors hover:border-blue-500/50 hover:bg-blue-500/10"
        >
          <div className="text-sm font-medium text-white">🛡️ 방어</div>
          <div className="text-xs text-slate-500">피해 50% 감소</div>
        </button>
      </div>

      <div className="mt-2 grid grid-cols-3 gap-2">
        {player.skills.map((skill) => {
          const canUse = player.currentMP >= skill.mpCost;
          const typeInfo = SKILL_TYPE_LABELS[skill.type];

          return (
            <button
              key={skill.id}
              disabled={!canUse}
              onClick={() =>
                useBattleStore.getState().playerAction({ type: "skill", skill })
              }
              className={cn(
                "rounded-lg border px-3 py-2.5 text-left transition-colors",
                canUse
                  ? "border-slate-600 bg-slate-900 hover:border-violet-500/50 hover:bg-violet-500/10"
                  : "cursor-not-allowed border-slate-700/50 bg-slate-900/50 opacity-40",
              )}
            >
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium text-white">{skill.name}</span>
                <span className={cn("text-xs", typeInfo.color)}>{typeInfo.label}</span>
              </div>
              <div className="text-xs text-blue-400">MP {skill.mpCost}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// --- Battle log ---

const BattleLog = memo(function BattleLog({ logs }: { logs: BattleLogEntry[] }) {
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs.length]);

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
      <div className="mb-2 text-sm font-medium text-slate-300">전투 로그</div>
      <div className="max-h-40 space-y-0.5 overflow-y-auto text-xs">
        {logs.map((log, i) => (
          <div key={i} className={cn(LOG_COLORS[log.type])}>
            <span className="mr-1 text-slate-600">[{log.turn}]</span>
            {log.message}
          </div>
        ))}
        <div ref={logEndRef} />
      </div>
    </div>
  );
});
