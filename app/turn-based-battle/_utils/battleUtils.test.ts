import { describe, expect, it, vi } from "vitest";
import type { Fighter, StatusEffect, Skill } from "../_types";
import {
  getEffectiveStat,
  calculateAttackDamage,
  applyDefenseReduction,
  applyBuffOrDebuff,
  tickEffects,
  executeAction,
  createAIFighter,
  getAIAction,
  determineFirstAttacker,
} from "./battleUtils";

// --- Test helpers ---

function createFighter(overrides: Partial<Fighter> = {}): Fighter {
  return {
    name: "테스터",
    characterClass: "warrior",
    baseStats: { HP: 100, MP: 50, ATK: 10, DEF: 8, SPD: 10 },
    currentHP: 100,
    currentMP: 50,
    maxHP: 100,
    maxMP: 50,
    skills: [],
    buffs: [],
    debuffs: [],
    isDefending: false,
    ...overrides,
  };
}

function createBuff(overrides: Partial<StatusEffect> = {}): StatusEffect {
  return {
    name: "공격 강화",
    stat: "ATK",
    amount: 5,
    turns: 3,
    icon: "⚔️",
    isBuff: true,
    ...overrides,
  };
}

function createDebuff(overrides: Partial<StatusEffect> = {}): StatusEffect {
  return {
    name: "공격 저하",
    stat: "ATK",
    amount: 3,
    turns: 3,
    icon: "⬇️",
    isBuff: false,
    ...overrides,
  };
}

// --- getEffectiveStat ---

describe("getEffectiveStat", () => {
  it("returns base stat when no buffs or debuffs", () => {
    const fighter = createFighter();
    expect(getEffectiveStat(fighter, "ATK")).toBe(10);
    expect(getEffectiveStat(fighter, "DEF")).toBe(8);
    expect(getEffectiveStat(fighter, "SPD")).toBe(10);
  });

  it("adds buff amount to base stat", () => {
    const fighter = createFighter({
      buffs: [createBuff({ stat: "ATK", amount: 5 })],
    });
    expect(getEffectiveStat(fighter, "ATK")).toBe(15);
  });

  it("subtracts debuff amount from base stat", () => {
    const fighter = createFighter({
      debuffs: [createDebuff({ stat: "ATK", amount: 3 })],
    });
    expect(getEffectiveStat(fighter, "ATK")).toBe(7);
  });

  it("combines multiple buffs and debuffs", () => {
    const fighter = createFighter({
      buffs: [
        createBuff({ stat: "ATK", amount: 5 }),
        createBuff({ stat: "ATK", amount: 3, name: "추가 강화" }),
      ],
      debuffs: [createDebuff({ stat: "ATK", amount: 4 })],
    });
    // 10 + 5 + 3 - 4 = 14
    expect(getEffectiveStat(fighter, "ATK")).toBe(14);
  });

  it("clamps to minimum 0", () => {
    const fighter = createFighter({
      debuffs: [createDebuff({ stat: "ATK", amount: 20 })],
    });
    expect(getEffectiveStat(fighter, "ATK")).toBe(0);
  });

  it("ignores buffs/debuffs for other stats", () => {
    const fighter = createFighter({
      buffs: [createBuff({ stat: "ATK", amount: 10 })],
    });
    expect(getEffectiveStat(fighter, "DEF")).toBe(8);
  });
});

// --- applyDefenseReduction ---

describe("applyDefenseReduction", () => {
  it("returns same damage when not defending", () => {
    expect(applyDefenseReduction(20, false)).toBe(20);
  });

  it("halves damage when defending", () => {
    expect(applyDefenseReduction(20, true)).toBe(10);
  });

  it("rounds to nearest integer", () => {
    expect(applyDefenseReduction(15, true)).toBe(8);
  });

  it("clamps minimum damage to 1", () => {
    expect(applyDefenseReduction(1, true)).toBe(1);
  });
});

// --- calculateAttackDamage ---

describe("calculateAttackDamage", () => {
  it("returns at least 1 damage", () => {
    const attacker = createFighter({ baseStats: { HP: 100, MP: 50, ATK: 1, DEF: 0, SPD: 10 } });
    const defender = createFighter({ baseStats: { HP: 100, MP: 50, ATK: 10, DEF: 50, SPD: 10 } });
    expect(calculateAttackDamage(attacker, defender)).toBeGreaterThanOrEqual(1);
  });

  it("applies multiplier to damage", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    const attacker = createFighter({ baseStats: { HP: 100, MP: 50, ATK: 20, DEF: 0, SPD: 10 } });
    const defender = createFighter({ baseStats: { HP: 100, MP: 50, ATK: 10, DEF: 0, SPD: 10 } });

    const baseDamage = calculateAttackDamage(attacker, defender, 1.0);
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    const multipliedDamage = calculateAttackDamage(attacker, defender, 2.0);

    expect(multipliedDamage).toBeGreaterThan(baseDamage);
    vi.restoreAllMocks();
  });
});

// --- applyBuffOrDebuff ---

describe("applyBuffOrDebuff", () => {
  it("adds a new buff", () => {
    const fighter = createFighter();
    const buff = createBuff();
    const result = applyBuffOrDebuff(fighter, buff);

    expect(result.buffs).toHaveLength(1);
    expect(result.buffs[0].name).toBe("공격 강화");
  });

  it("adds a new debuff", () => {
    const fighter = createFighter();
    const debuff = createDebuff();
    const result = applyBuffOrDebuff(fighter, debuff);

    expect(result.debuffs).toHaveLength(1);
    expect(result.debuffs[0].name).toBe("공격 저하");
  });

  it("overwrites existing buff with same name", () => {
    const fighter = createFighter({
      buffs: [createBuff({ turns: 1 })],
    });
    const newBuff = createBuff({ turns: 3 });
    const result = applyBuffOrDebuff(fighter, newBuff);

    expect(result.buffs).toHaveLength(1);
    expect(result.buffs[0].turns).toBe(3);
  });

  it("does not mutate the original fighter", () => {
    const fighter = createFighter();
    applyBuffOrDebuff(fighter, createBuff());
    expect(fighter.buffs).toHaveLength(0);
  });
});

// --- tickEffects ---

describe("tickEffects", () => {
  it("decrements buff turns", () => {
    const fighter = createFighter({
      buffs: [createBuff({ turns: 3 })],
    });
    const result = tickEffects(fighter);

    expect(result.fighter.buffs).toHaveLength(1);
    expect(result.fighter.buffs[0].turns).toBe(2);
  });

  it("removes expired buffs and logs expiry", () => {
    const fighter = createFighter({
      buffs: [createBuff({ turns: 1, name: "테스트 버프" })],
    });
    const result = tickEffects(fighter);

    expect(result.fighter.buffs).toHaveLength(0);
    expect(result.logs).toHaveLength(1);
    expect(result.logs[0]).toContain("테스트 버프");
    expect(result.logs[0]).toContain("만료");
  });

  it("applies poison damage", () => {
    const fighter = createFighter({
      currentHP: 50,
      debuffs: [createDebuff({ stat: "poison", amount: 8, turns: 3 })],
    });
    const result = tickEffects(fighter);

    expect(result.poisonDamage).toBe(8);
    expect(result.fighter.currentHP).toBe(42);
  });

  it("clamps HP to 0 on lethal poison", () => {
    const fighter = createFighter({
      currentHP: 5,
      debuffs: [createDebuff({ stat: "poison", amount: 10, turns: 3 })],
    });
    const result = tickEffects(fighter);

    expect(result.fighter.currentHP).toBe(0);
  });

  it("returns 0 poison damage when no poison", () => {
    const fighter = createFighter();
    const result = tickEffects(fighter);
    expect(result.poisonDamage).toBe(0);
  });

  it("does not mutate the original fighter", () => {
    const fighter = createFighter({
      buffs: [createBuff({ turns: 1 })],
    });
    tickEffects(fighter);
    expect(fighter.buffs).toHaveLength(1);
    expect(fighter.buffs[0].turns).toBe(1);
  });
});

// --- executeAction ---

describe("executeAction", () => {
  const actor = createFighter({ name: "공격자", currentMP: 30 });
  const target = createFighter({ name: "방어자" });

  describe("defend", () => {
    it("sets isDefending to true", () => {
      const result = executeAction(actor, target, { type: "defend" }, 1);
      expect(result.actor.isDefending).toBe(true);
      expect(result.logs[0].type).toBe("defend");
    });

    it("does not modify target", () => {
      const result = executeAction(actor, target, { type: "defend" }, 1);
      expect(result.target).toBe(target);
    });
  });

  describe("basic attack", () => {
    it("deals damage to target", () => {
      const result = executeAction(actor, target, { type: "attack" }, 1);
      expect(result.target.currentHP).toBeLessThan(target.currentHP);
      expect(result.damageDealt).toBeGreaterThanOrEqual(1);
      expect(result.logs[0].type).toBe("damage");
    });

    it("reduces damage when target is defending", () => {
      const defendingTarget = createFighter({ name: "방어자", isDefending: true });

      vi.spyOn(Math, "random").mockReturnValue(0.5);
      const normalResult = executeAction(actor, target, { type: "attack" }, 1);

      vi.spyOn(Math, "random").mockReturnValue(0.5);
      const defendResult = executeAction(actor, defendingTarget, { type: "attack" }, 1);

      expect(defendResult.damageDealt!).toBeLessThan(normalResult.damageDealt!);
      vi.restoreAllMocks();
    });
  });

  describe("skill - attack", () => {
    const attackSkill: Skill = {
      id: "s1",
      name: "강타",
      type: "attack",
      mpCost: 10,
      multiplier: 1.5,
    };

    it("deals damage and consumes MP", () => {
      const result = executeAction(actor, target, { type: "skill", skill: attackSkill }, 1);
      expect(result.actor.currentMP).toBe(actor.currentMP - attackSkill.mpCost);
      expect(result.damageDealt).toBeGreaterThanOrEqual(1);
      expect(result.logs[0].type).toBe("damage");
    });

    it("fails gracefully when MP is insufficient", () => {
      const lowMPActor = createFighter({ name: "공격자", currentMP: 5 });
      const result = executeAction(lowMPActor, target, { type: "skill", skill: attackSkill }, 1);
      expect(result.actor.currentMP).toBe(5);
      expect(result.logs[0].type).toBe("system");
      expect(result.damageDealt).toBeUndefined();
    });
  });

  describe("skill - heal", () => {
    const healSkill: Skill = {
      id: "s2",
      name: "치유",
      type: "heal",
      mpCost: 10,
      healAmount: 30,
    };

    it("restores HP and consumes MP", () => {
      const injuredActor = createFighter({ name: "공격자", currentHP: 50, currentMP: 30 });
      const result = executeAction(injuredActor, target, { type: "skill", skill: healSkill }, 1);

      expect(result.actor.currentHP).toBe(80);
      expect(result.actor.currentMP).toBe(20);
      expect(result.healedAmount).toBe(30);
      expect(result.logs[0].type).toBe("heal");
    });

    it("caps healing at max HP", () => {
      const nearFullActor = createFighter({ name: "공격자", currentHP: 90, currentMP: 30 });
      const result = executeAction(nearFullActor, target, { type: "skill", skill: healSkill }, 1);

      expect(result.actor.currentHP).toBe(100);
      expect(result.healedAmount).toBe(10);
    });
  });

  describe("skill - buff", () => {
    const buffSkill: Skill = {
      id: "s3",
      name: "철벽",
      type: "buff",
      mpCost: 8,
      buffStat: "DEF",
      statAmount: 5,
      duration: 3,
    };

    it("adds buff to actor and consumes MP", () => {
      const result = executeAction(actor, target, { type: "skill", skill: buffSkill }, 1);

      expect(result.actor.buffs).toHaveLength(1);
      expect(result.actor.buffs[0].stat).toBe("DEF");
      expect(result.actor.buffs[0].amount).toBe(5);
      expect(result.actor.currentMP).toBe(actor.currentMP - buffSkill.mpCost);
      expect(result.logs[0].type).toBe("buff");
    });
  });

  describe("skill - debuff", () => {
    const debuffSkill: Skill = {
      id: "s4",
      name: "위협",
      type: "debuff",
      mpCost: 10,
      debuffStat: "ATK",
      statAmount: 5,
      duration: 3,
    };

    it("adds debuff to target and consumes MP", () => {
      const result = executeAction(actor, target, { type: "skill", skill: debuffSkill }, 1);

      expect(result.target.debuffs).toHaveLength(1);
      expect(result.target.debuffs[0].stat).toBe("ATK");
      expect(result.actor.currentMP).toBe(actor.currentMP - debuffSkill.mpCost);
      expect(result.logs[0].type).toBe("debuff");
    });

    it("applies poison debuff", () => {
      const poisonSkill: Skill = {
        id: "s5",
        name: "독화살",
        type: "debuff",
        mpCost: 10,
        debuffStat: "poison",
        statAmount: 8,
        duration: 3,
        poisonDamage: 8,
      };
      const result = executeAction(actor, target, { type: "skill", skill: poisonSkill }, 1);

      expect(result.target.debuffs).toHaveLength(1);
      expect(result.target.debuffs[0].stat).toBe("poison");
      expect(result.target.debuffs[0].amount).toBe(8);
    });
  });
});

// --- createAIFighter ---

describe("createAIFighter", () => {
  it("creates a fighter with a different class than player", () => {
    const ai = createAIFighter("warrior", "normal");
    expect(ai.characterClass).not.toBe("warrior");
  });

  it("creates a fighter with 3 skills", () => {
    const ai = createAIFighter("mage", "normal");
    expect(ai.skills).toHaveLength(3);
  });

  it("applies difficulty multiplier (easy has lower stats)", () => {
    const results = Array.from({ length: 20 }, () =>
      createAIFighter("warrior", "easy"),
    );
    const avgHP = results.reduce((sum, ai) => sum + ai.maxHP, 0) / results.length;

    const hardResults = Array.from({ length: 20 }, () =>
      createAIFighter("warrior", "hard"),
    );
    const hardAvgHP = hardResults.reduce((sum, ai) => sum + ai.maxHP, 0) / hardResults.length;

    expect(hardAvgHP).toBeGreaterThan(avgHP);
  });

  it("initializes HP and MP to max values", () => {
    const ai = createAIFighter("archer", "normal");
    expect(ai.currentHP).toBe(ai.maxHP);
    expect(ai.currentMP).toBe(ai.maxMP);
  });

  it("starts with empty buffs and debuffs", () => {
    const ai = createAIFighter("warrior", "normal");
    expect(ai.buffs).toHaveLength(0);
    expect(ai.debuffs).toHaveLength(0);
    expect(ai.isDefending).toBe(false);
  });
});

// --- getAIAction ---

describe("getAIAction", () => {
  const healSkill: Skill = { id: "h1", name: "치유", type: "heal", mpCost: 10, healAmount: 20 };
  const attackSkill: Skill = { id: "a1", name: "강타", type: "attack", mpCost: 8, multiplier: 1.5 };

  it("easy: heals when HP is very low", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.99);
    const ai = createFighter({ currentHP: 10, maxHP: 100, skills: [healSkill, attackSkill] });
    const player = createFighter();

    const action = getAIAction(ai, player, "easy");
    expect(action.type).toBe("skill");
    if (action.type === "skill") expect(action.skill.type).toBe("heal");
    vi.restoreAllMocks();
  });

  it("normal: defends when HP is low and no heal available", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.99);
    const ai = createFighter({ currentHP: 20, maxHP: 100, skills: [attackSkill] });
    const player = createFighter();

    const action = getAIAction(ai, player, "normal");
    expect(action.type).toBe("defend");
    vi.restoreAllMocks();
  });

  it("hard: heals when HP is low", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.99);
    const ai = createFighter({ currentHP: 25, maxHP: 100, skills: [healSkill, attackSkill] });
    const player = createFighter();

    const action = getAIAction(ai, player, "hard");
    expect(action.type).toBe("skill");
    if (action.type === "skill") expect(action.skill.type).toBe("heal");
    vi.restoreAllMocks();
  });

  it("returns basic attack when no MP available", () => {
    const ai = createFighter({ currentMP: 0, skills: [attackSkill] });
    const player = createFighter();

    const action = getAIAction(ai, player, "easy");
    expect(action.type).toBe("attack");
  });
});

// --- determineFirstAttacker ---

describe("determineFirstAttacker", () => {
  it("player goes first when faster", () => {
    const player = createFighter({ baseStats: { HP: 100, MP: 50, ATK: 10, DEF: 8, SPD: 15 } });
    const enemy = createFighter({ baseStats: { HP: 100, MP: 50, ATK: 10, DEF: 8, SPD: 10 } });

    expect(determineFirstAttacker(player, enemy)).toBe("player");
  });

  it("enemy goes first when faster", () => {
    const player = createFighter({ baseStats: { HP: 100, MP: 50, ATK: 10, DEF: 8, SPD: 5 } });
    const enemy = createFighter({ baseStats: { HP: 100, MP: 50, ATK: 10, DEF: 8, SPD: 10 } });

    expect(determineFirstAttacker(player, enemy)).toBe("enemy");
  });

  it("randomly decides on SPD tie", () => {
    const player = createFighter({ baseStats: { HP: 100, MP: 50, ATK: 10, DEF: 8, SPD: 10 } });
    const enemy = createFighter({ baseStats: { HP: 100, MP: 50, ATK: 10, DEF: 8, SPD: 10 } });

    vi.spyOn(Math, "random").mockReturnValue(0.3);
    expect(determineFirstAttacker(player, enemy)).toBe("player");

    vi.spyOn(Math, "random").mockReturnValue(0.7);
    expect(determineFirstAttacker(player, enemy)).toBe("enemy");

    vi.restoreAllMocks();
  });
});
