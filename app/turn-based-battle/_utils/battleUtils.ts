import type {
  Fighter,
  StatusEffect,
  Skill,
  BattleLogEntry,
  BattleAction,
  ActionResult,
  Difficulty,
  CharacterClass,
  BaseStats,
  BuffableStat,
} from "../_types";
import {
  CLASS_DATA,
  CLASS_SKILLS,
  AI_NAMES,
  DIFFICULTY_CONFIG,
} from "../_constants";

// --- Pure helpers ---

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function randomVariance(value: number, percent: number = 0.1): number {
  const variance = value * percent;
  return Math.round(value + (Math.random() * 2 - 1) * variance);
}

// --- Stat calculation ---

export function getEffectiveStat(fighter: Fighter, stat: BuffableStat): number {
  const base = fighter.baseStats[stat];
  let mod = 0;

  for (const b of fighter.buffs) {
    if (b.stat === stat) mod += b.amount;
  }
  for (const d of fighter.debuffs) {
    if (d.stat === stat) mod -= d.amount;
  }

  return Math.max(0, base + mod);
}

// --- Damage & defense ---

export function calculateAttackDamage(
  attacker: Fighter,
  defender: Fighter,
  multiplier: number = 1.0,
): number {
  const atk = getEffectiveStat(attacker, "ATK");
  const def = getEffectiveStat(defender, "DEF");
  const raw = atk * multiplier - def * 0.5;
  const damage = randomVariance(Math.max(1, raw));
  return Math.max(1, damage);
}

export function applyDefenseReduction(damage: number, isDefending: boolean): number {
  if (!isDefending) return damage;
  return Math.max(1, Math.round(damage * 0.5));
}

// --- Buff/Debuff ---

export function applyBuffOrDebuff(fighter: Fighter, effect: StatusEffect): Fighter {
  const list = effect.isBuff ? [...fighter.buffs] : [...fighter.debuffs];
  const existingIdx = list.findIndex((e) => e.name === effect.name);

  if (existingIdx >= 0) {
    list[existingIdx] = { ...effect };
  } else {
    list.push({ ...effect });
  }

  return effect.isBuff
    ? { ...fighter, buffs: list }
    : { ...fighter, debuffs: list };
}

export function tickEffects(fighter: Fighter): {
  fighter: Fighter;
  logs: string[];
  poisonDamage: number;
} {
  const logs: string[] = [];
  let poisonDamage = 0;

  for (const d of fighter.debuffs) {
    if (d.stat === "poison") {
      poisonDamage += d.amount;
    }
  }

  const newBuffs: StatusEffect[] = [];
  for (const b of fighter.buffs) {
    const remaining = b.turns - 1;
    if (remaining <= 0) {
      logs.push(`${fighter.name}의 ${b.name} 효과가 만료되었다!`);
    } else {
      newBuffs.push({ ...b, turns: remaining });
    }
  }

  const newDebuffs: StatusEffect[] = [];
  for (const d of fighter.debuffs) {
    const remaining = d.turns - 1;
    if (remaining <= 0) {
      logs.push(`${fighter.name}의 ${d.name} 효과가 만료되었다!`);
    } else {
      newDebuffs.push({ ...d, turns: remaining });
    }
  }

  return {
    fighter: {
      ...fighter,
      buffs: newBuffs,
      debuffs: newDebuffs,
      currentHP: Math.max(0, fighter.currentHP - poisonDamage),
    },
    logs,
    poisonDamage,
  };
}

// --- Action execution (returns structured data, no regex parsing needed) ---

export function executeAction(
  actor: Fighter,
  target: Fighter,
  action: BattleAction,
  turn: number,
): ActionResult {
  const logs: BattleLogEntry[] = [];

  if (action.type === "defend") {
    logs.push({
      turn,
      message: `${actor.name}이(가) 방어 태세를 취했다!`,
      type: "defend",
    });
    return { actor: { ...actor, isDefending: true }, target, logs };
  }

  if (action.type === "attack") {
    let damage = calculateAttackDamage(actor, target);
    damage = applyDefenseReduction(damage, target.isDefending);

    logs.push({
      turn,
      message: `${actor.name}이(가) ${target.name}에게 기본 공격! ${damage} 피해!`,
      type: "damage",
    });

    return {
      actor,
      target: { ...target, currentHP: Math.max(0, target.currentHP - damage) },
      logs,
      damageDealt: damage,
    };
  }

  // --- Skill action ---
  const skill = action.skill;

  // MP guard
  if (actor.currentMP < skill.mpCost) {
    logs.push({ turn, message: `${actor.name}의 MP가 부족하다!`, type: "system" });
    return { actor, target, logs };
  }

  let updatedActor = { ...actor, currentMP: actor.currentMP - skill.mpCost };
  let updatedTarget = { ...target };
  let damageDealt: number | undefined;
  let healedAmount: number | undefined;

  switch (skill.type) {
    case "attack": {
      let damage = calculateAttackDamage(actor, target, skill.multiplier);
      damage = applyDefenseReduction(damage, target.isDefending);
      updatedTarget = { ...updatedTarget, currentHP: Math.max(0, updatedTarget.currentHP - damage) };
      damageDealt = damage;
      logs.push({
        turn,
        message: `${actor.name}이(가) ${skill.name} 사용! ${target.name}에게 ${damage} 피해!`,
        type: "damage",
      });
      break;
    }
    case "heal": {
      const healed = Math.min(skill.healAmount, updatedActor.maxHP - updatedActor.currentHP);
      updatedActor = { ...updatedActor, currentHP: updatedActor.currentHP + healed };
      healedAmount = healed;
      logs.push({
        turn,
        message: `${actor.name}이(가) ${skill.name} 사용! HP ${healed} 회복!`,
        type: "heal",
      });
      break;
    }
    case "buff": {
      const effect: StatusEffect = {
        name: skill.name,
        stat: skill.buffStat,
        amount: skill.statAmount,
        turns: skill.duration,
        icon: skill.buffStat === "ATK" ? "⚔️" : skill.buffStat === "DEF" ? "🛡️" : "💨",
        isBuff: true,
      };
      updatedActor = applyBuffOrDebuff(updatedActor, effect);
      logs.push({
        turn,
        message: `${actor.name}이(가) ${skill.name} 사용! ${skill.buffStat} +${skill.statAmount} (${skill.duration}턴)`,
        type: "buff",
      });
      break;
    }
    case "debuff": {
      if (skill.debuffStat === "poison") {
        const poisonAmount = skill.poisonDamage ?? skill.statAmount;
        const effect: StatusEffect = {
          name: skill.name, stat: "poison", amount: poisonAmount,
          turns: skill.duration, icon: "☠️", isBuff: false,
        };
        updatedTarget = applyBuffOrDebuff(updatedTarget, effect);
        logs.push({
          turn,
          message: `${actor.name}이(가) ${skill.name} 사용! ${target.name}에게 독 부여! (${skill.duration}턴, 매턴 ${poisonAmount} 피해)`,
          type: "debuff",
        });
      } else {
        const effect: StatusEffect = {
          name: skill.name, stat: skill.debuffStat, amount: skill.statAmount,
          turns: skill.duration, icon: "⬇️", isBuff: false,
        };
        updatedTarget = applyBuffOrDebuff(updatedTarget, effect);
        logs.push({
          turn,
          message: `${actor.name}이(가) ${skill.name} 사용! ${target.name}의 ${skill.debuffStat} -${skill.statAmount} (${skill.duration}턴)`,
          type: "debuff",
        });
      }
      break;
    }
  }

  return { actor: updatedActor, target: updatedTarget, logs, damageDealt, healedAmount };
}

// --- AI ---

export function createAIFighter(playerClass: CharacterClass, difficulty: Difficulty): Fighter {
  const availableClasses = (Object.keys(CLASS_DATA) as CharacterClass[]).filter((c) => c !== playerClass);
  const aiClass = availableClasses[Math.floor(Math.random() * availableClasses.length)];

  const classInfo = CLASS_DATA[aiClass];
  const mult = DIFFICULTY_CONFIG[difficulty].multiplier;

  // Percentage-based variance (±3%) instead of additive to avoid disproportional impact on low stats
  const applyMultiplier = (val: number) => {
    const base = Math.round(val * mult);
    const variance = Math.round(base * 0.03);
    return base + Math.floor(Math.random() * (variance * 2 + 1)) - variance;
  };

  const stats: BaseStats = {
    HP: applyMultiplier(classInfo.stats.HP),
    MP: applyMultiplier(classInfo.stats.MP),
    ATK: applyMultiplier(classInfo.stats.ATK),
    DEF: applyMultiplier(classInfo.stats.DEF),
    SPD: applyMultiplier(classInfo.stats.SPD),
  };

  const skills = shuffle(CLASS_SKILLS[aiClass]).slice(0, 3);

  return {
    name: AI_NAMES[aiClass],
    characterClass: aiClass,
    baseStats: stats,
    currentHP: stats.HP,
    currentMP: stats.MP,
    maxHP: stats.HP,
    maxMP: stats.MP,
    skills,
    buffs: [],
    debuffs: [],
    isDefending: false,
  };
}

export function getAIAction(ai: Fighter, player: Fighter, difficulty: Difficulty): BattleAction {
  const hpPercent = ai.currentHP / ai.maxHP;
  const usableSkills = ai.skills.filter((s) => s.mpCost <= ai.currentMP);

  const healSkills = usableSkills.filter((s) => s.type === "heal");
  const attackSkills = usableSkills.filter((s) => s.type === "attack");
  const buffSkills = usableSkills.filter((s) => s.type === "buff");
  const debuffSkills = usableSkills.filter(
    (s) => s.type === "debuff" && !player.debuffs.some((d) => d.name === s.name),
  );

  const rand = Math.random();

  if (difficulty === "easy") {
    if (hpPercent <= 0.15 && healSkills.length > 0) {
      return { type: "skill", skill: healSkills[0] };
    }
    if (rand < 0.3 && attackSkills.length > 0) {
      return { type: "skill", skill: attackSkills[0] };
    }
    return { type: "attack" };
  }

  if (difficulty === "normal") {
    if (hpPercent <= 0.25) {
      if (healSkills.length > 0) return { type: "skill", skill: healSkills[0] };
      return { type: "defend" };
    }
    if (rand < 0.5) {
      const pool = [...attackSkills, ...buffSkills, ...debuffSkills];
      if (pool.length > 0) {
        return { type: "skill", skill: pool[Math.floor(Math.random() * pool.length)] };
      }
    }
    return { type: "attack" };
  }

  // Hard
  if (hpPercent <= 0.3 && healSkills.length > 0) {
    return { type: "skill", skill: healSkills[0] };
  }
  if (hpPercent <= 0.3) return { type: "defend" };

  if (rand < 0.3 && buffSkills.length > 0) {
    const unbuffed = buffSkills.filter((s) => s.type === "buff" && !ai.buffs.some((b) => b.name === s.name));
    if (unbuffed.length > 0) return { type: "skill", skill: unbuffed[0] };
  }
  if (rand < 0.5 && debuffSkills.length > 0) {
    return { type: "skill", skill: debuffSkills[0] };
  }
  if (attackSkills.length > 0 && rand < 0.8) {
    return { type: "skill", skill: attackSkills[0] };
  }
  return { type: "attack" };
}

// --- Turn order ---

export function determineFirstAttacker(player: Fighter, enemy: Fighter): "player" | "enemy" {
  const playerSPD = getEffectiveStat(player, "SPD");
  const enemySPD = getEffectiveStat(enemy, "SPD");

  if (playerSPD === enemySPD) {
    return Math.random() < 0.5 ? "player" : "enemy";
  }
  return playerSPD > enemySPD ? "player" : "enemy";
}
