export type Phase = "settings" | "battle" | "result";

export type CharacterClass = "warrior" | "mage" | "archer";

export type Difficulty = "easy" | "normal" | "hard";

export type SkillType = "attack" | "buff" | "debuff" | "heal";

export type BuffableStat = "ATK" | "DEF" | "SPD";

export type DebuffableStat = "ATK" | "DEF" | "SPD" | "poison";

export type SetupStep = 1 | 2 | 3;

export interface ClassInfo {
  label: string;
  emoji: string;
  color: string;
  stats: BaseStats;
}

export interface BaseStats {
  HP: number;
  MP: number;
  ATK: number;
  DEF: number;
  SPD: number;
}

// Discriminated union for type-safe skill data
interface SkillBase {
  id: string;
  name: string;
  mpCost: number;
  isCustom?: boolean;
}

export interface AttackSkill extends SkillBase {
  type: "attack";
  multiplier: number;
}

export interface HealSkill extends SkillBase {
  type: "heal";
  healAmount: number;
}

export interface BuffSkill extends SkillBase {
  type: "buff";
  buffStat: BuffableStat;
  statAmount: number;
  duration: number;
}

export interface DebuffSkill extends SkillBase {
  type: "debuff";
  debuffStat: DebuffableStat;
  statAmount: number;
  duration: number;
  poisonDamage?: number; // only when debuffStat === "poison"
}

export type Skill = AttackSkill | HealSkill | BuffSkill | DebuffSkill;

export interface StatusEffect {
  name: string;
  stat: BuffableStat | "poison";
  amount: number;
  turns: number;
  icon: string;
  isBuff: boolean;
}

export interface Fighter {
  name: string;
  characterClass: CharacterClass;
  baseStats: BaseStats;
  currentHP: number;
  currentMP: number;
  maxHP: number;
  maxMP: number;
  skills: Skill[];
  buffs: StatusEffect[];
  debuffs: StatusEffect[];
  isDefending: boolean;
}

export type BattleAction =
  | { type: "attack" }
  | { type: "defend" }
  | { type: "skill"; skill: Skill };

export type BattleLogType =
  | "damage"
  | "heal"
  | "buff"
  | "debuff"
  | "poison"
  | "system"
  | "defend";

export interface BattleLogEntry {
  turn: number;
  message: string;
  type: BattleLogType;
}

export interface ActionResult {
  actor: Fighter;
  target: Fighter;
  logs: BattleLogEntry[];
  damageDealt?: number;
  healedAmount?: number;
}

export interface BattleResult {
  winner: "player" | "enemy";
  totalTurns: number;
  playerRemainingHP: number;
  enemyRemainingHP: number;
}

export interface FloatingDamage {
  id: number;
  target: "player" | "enemy";
  value: string;
  type: "damage" | "heal";
}

export const MAX_TURNS = 100;
