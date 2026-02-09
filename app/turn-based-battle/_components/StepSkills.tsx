import { useState } from "react";
import { cn } from "../../_utils";
import {
  CLASS_SKILLS,
  MAX_SELECTED_SKILLS,
  MAX_SKILL_NAME_LENGTH,
  SKILL_TYPE_LABELS,
} from "../_constants";
import { useBattleStore } from "../_store/useBattleStore";
import type { Skill, SkillType, BuffableStat, DebuffableStat } from "../_types";

export default function StepSkills() {
  const playerClass = useBattleStore((s) => s.playerClass);
  const selectedSkills = useBattleStore((s) => s.selectedSkills);
  const customSkills = useBattleStore((s) => s.customSkills);
  const toggleSkill = useBattleStore((s) => s.toggleSkill);
  const setStep = useBattleStore((s) => s.setStep);

  const [showCustomForm, setShowCustomForm] = useState(false);

  if (!playerClass) return null;

  const classSkills = CLASS_SKILLS[playerClass];
  const allSkills = [...classSkills, ...customSkills];
  const isValid = selectedSkills.length === MAX_SELECTED_SKILLS;

  return (
    <div className="w-full max-w-lg space-y-6">
      <div>
        <div className="mb-1 flex items-center justify-between">
          <label className="text-sm font-medium text-slate-300">
            스킬 선택 ({selectedSkills.length}/{MAX_SELECTED_SKILLS})
          </label>
          <span className="text-xs text-slate-500">
            클래스 스킬 중 {MAX_SELECTED_SKILLS}개를 선택하세요
          </span>
        </div>

        <div className="space-y-2">
          {allSkills.map((skill) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              selected={selectedSkills.some((s) => s.id === skill.id)}
              disabled={
                selectedSkills.length >= MAX_SELECTED_SKILLS &&
                !selectedSkills.some((s) => s.id === skill.id)
              }
              onToggle={() => toggleSkill(skill)}
            />
          ))}
        </div>

        {!showCustomForm && (
          <button
            onClick={() => setShowCustomForm(true)}
            className="mt-3 w-full rounded-lg border-2 border-dashed border-slate-600 py-3 text-sm text-slate-400 transition-colors hover:border-violet-500 hover:text-violet-400"
          >
            + 커스텀 스킬 만들기
          </button>
        )}

        {showCustomForm && (
          <CustomSkillForm onClose={() => setShowCustomForm(false)} />
        )}
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setStep(1)}
          className="rounded-lg border border-slate-600 px-6 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800"
        >
          ← 이전
        </button>
        <button
          onClick={() => setStep(3)}
          disabled={!isValid}
          className="rounded-lg bg-violet-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          다음 →
        </button>
      </div>
    </div>
  );
}

function SkillCard({
  skill,
  selected,
  disabled,
  onToggle,
}: {
  skill: Skill;
  selected: boolean;
  disabled: boolean;
  onToggle: () => void;
}) {
  const removeCustomSkill = useBattleStore((s) => s.removeCustomSkill);
  const typeInfo = SKILL_TYPE_LABELS[skill.type];

  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg border-2 p-3 text-left transition-all",
        selected
          ? "border-violet-500 bg-violet-500/10"
          : disabled
            ? "cursor-not-allowed border-slate-700/50 bg-slate-800/30 opacity-50"
            : "border-slate-700 bg-slate-800/50 hover:border-slate-600",
      )}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-white">{skill.name}</span>
          <span className={cn("rounded-full px-2 py-0.5 text-xs", typeInfo.color)}>
            {typeInfo.label}
          </span>
          {skill.isCustom && (
            <span className="rounded-full bg-violet-500/20 px-2 py-0.5 text-xs text-violet-400">
              커스텀
            </span>
          )}
        </div>
        <div className="mt-1 text-xs text-slate-400">
          {getSkillDescription(skill)}
        </div>
      </div>
      <div className="text-xs text-blue-400">MP {skill.mpCost}</div>
      {skill.isCustom && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            removeCustomSkill(skill.id);
          }}
          className="ml-1 rounded p-1 text-slate-500 hover:bg-red-500/20 hover:text-red-400"
        >
          ✕
        </button>
      )}
    </button>
  );
}

function getSkillDescription(skill: Skill): string {
  switch (skill.type) {
    case "attack":
      return `ATK ${Math.round(skill.multiplier * 100)}% 피해`;
    case "heal":
      return `HP ${skill.healAmount} 회복`;
    case "buff":
      return `자신 ${skill.buffStat} +${skill.statAmount} (${skill.duration}턴)`;
    case "debuff":
      if (skill.debuffStat === "poison") {
        return `독 부여 (${skill.duration}턴, 매턴 ${skill.poisonDamage ?? skill.statAmount} 피해)`;
      }
      return `적 ${skill.debuffStat} -${skill.statAmount} (${skill.duration}턴)`;
  }
}

function CustomSkillForm({ onClose }: { onClose: () => void }) {
  const addCustomSkill = useBattleStore((s) => s.addCustomSkill);

  const [name, setName] = useState("");
  const [type, setType] = useState<SkillType>("attack");
  const [mpCost, setMpCost] = useState(10);
  const [multiplier, setMultiplier] = useState(1.5);
  const [healAmount, setHealAmount] = useState(20);
  const [buffStat, setBuffStat] = useState<BuffableStat>("ATK");
  const [debuffStat, setDebuffStat] = useState<DebuffableStat>("ATK");
  const [statAmount, setStatAmount] = useState(5);
  const [duration, setDuration] = useState(3);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("스킬 이름을 입력하세요");
      return;
    }
    if (trimmed.length > MAX_SKILL_NAME_LENGTH) {
      setError(`이름은 ${MAX_SKILL_NAME_LENGTH}자 이내`);
      return;
    }

    const id = `custom_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

    let skill: Skill;
    switch (type) {
      case "attack":
        skill = { id, name: trimmed, type: "attack", mpCost, multiplier, isCustom: true };
        break;
      case "heal":
        skill = { id, name: trimmed, type: "heal", mpCost, healAmount, isCustom: true };
        break;
      case "buff":
        skill = { id, name: trimmed, type: "buff", mpCost, buffStat, statAmount, duration, isCustom: true };
        break;
      case "debuff":
        skill = {
          id, name: trimmed, type: "debuff", mpCost, debuffStat, statAmount, duration,
          ...(debuffStat === "poison" ? { poisonDamage: statAmount } : {}),
          isCustom: true,
        };
        break;
    }

    addCustomSkill(skill);
    onClose();
  };

  return (
    <div className="mt-3 space-y-3 rounded-lg border border-violet-500/30 bg-slate-800/80 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-violet-400">커스텀 스킬 만들기</h3>
        <button onClick={onClose} className="text-slate-500 hover:text-white">✕</button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-xs text-slate-400">스킬 이름</label>
          <input
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(""); }}
            maxLength={MAX_SKILL_NAME_LENGTH}
            placeholder="스킬 이름"
            className="w-full rounded border border-slate-600 bg-slate-900 px-3 py-1.5 text-sm text-white outline-none focus:border-violet-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-slate-400">스킬 타입</label>
          <div className="grid grid-cols-4 gap-2">
            {(["attack", "buff", "debuff", "heal"] as SkillType[]).map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={cn(
                  "rounded-md border px-2 py-1.5 text-xs transition-colors",
                  type === t
                    ? "border-violet-500 bg-violet-500/20 text-violet-300"
                    : "border-slate-600 text-slate-400 hover:border-slate-500",
                )}
              >
                {SKILL_TYPE_LABELS[t].label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs text-slate-400">MP 소모량 ({mpCost})</label>
          <input
            type="range" min={1} max={30} value={mpCost}
            onChange={(e) => setMpCost(Number(e.target.value))}
            className="range range-xs range-primary w-full"
          />
        </div>

        {type === "attack" && (
          <div>
            <label className="mb-1 block text-xs text-slate-400">배율 ({multiplier.toFixed(1)}x)</label>
            <input
              type="range" min={5} max={30} value={multiplier * 10}
              onChange={(e) => setMultiplier(Number(e.target.value) / 10)}
              className="range range-xs range-primary w-full"
            />
          </div>
        )}

        {type === "heal" && (
          <div>
            <label className="mb-1 block text-xs text-slate-400">회복량 ({healAmount})</label>
            <input
              type="range" min={5} max={60} value={healAmount}
              onChange={(e) => setHealAmount(Number(e.target.value))}
              className="range range-xs range-primary w-full"
            />
          </div>
        )}

        {type === "buff" && (
          <>
            <div>
              <label className="mb-1 block text-xs text-slate-400">대상 스탯</label>
              <div className="grid grid-cols-3 gap-2">
                {(["ATK", "DEF", "SPD"] as BuffableStat[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setBuffStat(s)}
                    className={cn(
                      "rounded-md border px-2 py-1.5 text-xs",
                      buffStat === s
                        ? "border-green-500 bg-green-500/20 text-green-300"
                        : "border-slate-600 text-slate-400 hover:border-slate-500",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs text-slate-400">변동 수치 ({statAmount})</label>
                <input
                  type="range" min={1} max={10} value={statAmount}
                  onChange={(e) => setStatAmount(Number(e.target.value))}
                  className="range range-xs range-primary w-full"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-400">지속 턴 ({duration})</label>
                <input
                  type="range" min={1} max={5} value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="range range-xs range-primary w-full"
                />
              </div>
            </div>
          </>
        )}

        {type === "debuff" && (
          <>
            <div>
              <label className="mb-1 block text-xs text-slate-400">대상 스탯</label>
              <div className="grid grid-cols-4 gap-2">
                {(["ATK", "DEF", "SPD", "poison"] as DebuffableStat[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setDebuffStat(s)}
                    className={cn(
                      "rounded-md border px-2 py-1.5 text-xs",
                      debuffStat === s
                        ? "border-red-500 bg-red-500/20 text-red-300"
                        : "border-slate-600 text-slate-400 hover:border-slate-500",
                    )}
                  >
                    {s === "poison" ? "독" : s}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs text-slate-400">
                  {debuffStat === "poison" ? "턴당 피해" : "변동 수치"} ({statAmount})
                </label>
                <input
                  type="range" min={1} max={10} value={statAmount}
                  onChange={(e) => setStatAmount(Number(e.target.value))}
                  className="range range-xs range-primary w-full"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-400">지속 턴 ({duration})</label>
                <input
                  type="range" min={1} max={5} value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="range range-xs range-primary w-full"
                />
              </div>
            </div>
          </>
        )}
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <button
        onClick={handleSubmit}
        className="w-full rounded-lg bg-violet-600 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-500"
      >
        스킬 추가
      </button>
    </div>
  );
}
