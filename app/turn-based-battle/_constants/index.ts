import type {
  CharacterClass,
  ClassInfo,
  Difficulty,
  Skill,
  SkillType,
} from "../_types";

export const CLASS_DATA: Record<CharacterClass, ClassInfo> = {
  warrior: {
    label: "전사",
    emoji: "⚔️",
    color: "red",
    stats: { HP: 130, MP: 50, ATK: 14, DEF: 12, SPD: 8 },
  },
  mage: {
    label: "마법사",
    emoji: "🔮",
    color: "blue",
    stats: { HP: 80, MP: 90, ATK: 18, DEF: 6, SPD: 10 },
  },
  archer: {
    label: "궁수",
    emoji: "🏹",
    color: "green",
    stats: { HP: 100, MP: 60, ATK: 16, DEF: 8, SPD: 14 },
  },
};

export const CLASS_SKILLS: Record<CharacterClass, Skill[]> = {
  warrior: [
    { id: "w1", name: "강타", type: "attack", mpCost: 8, multiplier: 1.6 },
    {
      id: "w2",
      name: "철벽",
      type: "buff",
      mpCost: 8,
      buffStat: "DEF",
      statAmount: 6,
      duration: 3,
    },
    {
      id: "w3",
      name: "위협",
      type: "debuff",
      mpCost: 10,
      debuffStat: "ATK",
      statAmount: 5,
      duration: 3,
    },
    { id: "w4", name: "전투 회복", type: "heal", mpCost: 10, healAmount: 25 },
    {
      id: "w5",
      name: "돌진",
      type: "attack",
      mpCost: 12,
      multiplier: 1.8,
    },
    {
      id: "w6",
      name: "전의 고양",
      type: "buff",
      mpCost: 10,
      buffStat: "ATK",
      statAmount: 5,
      duration: 3,
    },
    {
      id: "w7",
      name: "방패 강타",
      type: "debuff",
      mpCost: 12,
      debuffStat: "DEF",
      statAmount: 4,
      duration: 3,
    },
  ],
  mage: [
    {
      id: "m1",
      name: "파이어볼",
      type: "attack",
      mpCost: 14,
      multiplier: 1.8,
    },
    {
      id: "m2",
      name: "마법 보호막",
      type: "buff",
      mpCost: 10,
      buffStat: "DEF",
      statAmount: 7,
      duration: 3,
    },
    {
      id: "m3",
      name: "저주",
      type: "debuff",
      mpCost: 10,
      debuffStat: "ATK",
      statAmount: 5,
      duration: 3,
    },
    { id: "m4", name: "치유", type: "heal", mpCost: 12, healAmount: 35 },
    {
      id: "m5",
      name: "얼음 창",
      type: "attack",
      mpCost: 10,
      multiplier: 1.5,
    },
    {
      id: "m6",
      name: "마력 집중",
      type: "buff",
      mpCost: 8,
      buffStat: "ATK",
      statAmount: 6,
      duration: 3,
    },
    {
      id: "m7",
      name: "둔화",
      type: "debuff",
      mpCost: 10,
      debuffStat: "SPD",
      statAmount: 5,
      duration: 3,
    },
  ],
  archer: [
    {
      id: "a1",
      name: "정밀 사격",
      type: "attack",
      mpCost: 12,
      multiplier: 1.7,
    },
    {
      id: "a2",
      name: "집중",
      type: "buff",
      mpCost: 8,
      buffStat: "ATK",
      statAmount: 5,
      duration: 3,
    },
    {
      id: "a3",
      name: "독화살",
      type: "debuff",
      mpCost: 10,
      debuffStat: "poison",
      statAmount: 8,
      duration: 3,
      poisonDamage: 8,
    },
    {
      id: "a4",
      name: "응급 처치",
      type: "heal",
      mpCost: 8,
      healAmount: 20,
    },
    {
      id: "a5",
      name: "연사",
      type: "attack",
      mpCost: 14,
      multiplier: 1.9,
    },
    {
      id: "a6",
      name: "은신",
      type: "buff",
      mpCost: 10,
      buffStat: "SPD",
      statAmount: 5,
      duration: 3,
    },
    {
      id: "a7",
      name: "약점 간파",
      type: "debuff",
      mpCost: 10,
      debuffStat: "DEF",
      statAmount: 5,
      duration: 3,
    },
  ],
};

export const DIFFICULTY_CONFIG: Record<
  Difficulty,
  { label: string; multiplier: number; description: string }
> = {
  easy: {
    label: "쉬움",
    multiplier: 0.85,
    description: "AI 스탯 85%",
  },
  normal: {
    label: "보통",
    multiplier: 1.0,
    description: "AI 스탯 100%",
  },
  hard: {
    label: "어려움",
    multiplier: 1.2,
    description: "AI 스탯 120%",
  },
};

export const AI_NAMES: Record<CharacterClass, string> = {
  warrior: "그림자 기사",
  mage: "어둠의 현자",
  archer: "붉은 사냥꾼",
};

export const SKILL_TYPE_LABELS: Record<SkillType, { label: string; color: string }> = {
  attack: { label: "공격", color: "text-red-400" },
  buff: { label: "버프", color: "text-green-400" },
  debuff: { label: "디버프", color: "text-orange-400" },
  heal: { label: "회복", color: "text-blue-400" },
};

export const MAX_SELECTED_SKILLS = 3;
export const MAX_NAME_LENGTH = 10;
export const MAX_SKILL_NAME_LENGTH = 8;
