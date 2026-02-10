import { create } from "zustand";
import type {
  Phase,
  CharacterClass,
  Difficulty,
  Skill,
  Fighter,
  BattleLogEntry,
  BattleResult,
  BattleAction,
  FloatingDamage,
  SetupStep,
  ActionResult,
} from "../_types";
import { MAX_TURNS } from "../_types";
import { CLASS_DATA } from "../_constants";
import {
  createAIFighter,
  executeAction,
  tickEffects,
  determineFirstAttacker,
  getAIAction,
} from "../_utils/battleUtils";

// --- Helper: process one fighter's turn (tick + act) ---

let floatingIdSeq = 0;

function nextFloatingId(): number {
  return ++floatingIdSeq;
}

interface TurnStepResult {
  player: Fighter;
  enemy: Fighter;
  logs: BattleLogEntry[];
  gameOver: BattleResult | null;
  floating: FloatingDamage | null;
}

function processOneFighterTurn(
  who: "player" | "enemy",
  player: Fighter,
  enemy: Fighter,
  action: BattleAction,
  turnNumber: number,
): TurnStepResult {
  const logs: BattleLogEntry[] = [];
  let p = player;
  let e = enemy;

  // 1. Tick effects for acting fighter
  const actingFighter = who === "player" ? p : e;
  const tick = tickEffects(actingFighter);

  if (tick.poisonDamage > 0) {
    logs.push({
      turn: turnNumber,
      message: `${actingFighter.name}이(가) 독으로 ${tick.poisonDamage} 피해!`,
      type: "poison",
    });
  }
  tick.logs.forEach((msg) =>
    logs.push({ turn: turnNumber, message: msg, type: "system" }),
  );

  if (who === "player") p = tick.fighter;
  else e = tick.fighter;

  // 2. Check poison death
  if (tick.fighter.currentHP <= 0) {
    const winner = who === "player" ? "enemy" : "player";
    return {
      player: p, enemy: e, logs,
      gameOver: {
        winner,
        totalTurns: turnNumber,
        playerRemainingHP: winner === "player" ? p.currentHP : 0,
        enemyRemainingHP: winner === "enemy" ? e.currentHP : 0,
      },
      floating: null,
    };
  }

  // 3. Execute action
  const result: ActionResult =
    who === "player"
      ? executeAction(p, e, action, turnNumber)
      : executeAction(e, p, action, turnNumber);

  if (who === "player") {
    p = result.actor;
    e = result.target;
  } else {
    e = result.actor;
    p = result.target;
  }
  logs.push(...result.logs);

  // 4. Build floating damage from structured result (no regex)
  const floating = buildFloatingDamage(who, result);

  // 5. Check death after action
  if (p.currentHP <= 0) {
    return {
      player: p, enemy: e, logs,
      gameOver: {
        winner: "enemy", totalTurns: turnNumber,
        playerRemainingHP: 0, enemyRemainingHP: e.currentHP,
      },
      floating,
    };
  }
  if (e.currentHP <= 0) {
    return {
      player: p, enemy: e, logs,
      gameOver: {
        winner: "player", totalTurns: turnNumber,
        playerRemainingHP: p.currentHP, enemyRemainingHP: 0,
      },
      floating,
    };
  }

  return { player: p, enemy: e, logs, gameOver: null, floating };
}

function buildFloatingDamage(
  attacker: "player" | "enemy",
  result: ActionResult,
): FloatingDamage | null {
  if (result.damageDealt != null) {
    return {
      id: nextFloatingId(),
      target: attacker === "player" ? "enemy" : "player",
      value: `-${result.damageDealt}`,
      type: "damage",
    };
  }
  if (result.healedAmount != null && result.healedAmount > 0) {
    return {
      id: nextFloatingId(),
      target: attacker,
      value: `+${result.healedAmount}`,
      type: "heal",
    };
  }
  return null;
}

// --- Store ---

interface BattleState {
  phase: Phase;
  step: SetupStep;
  playerName: string;
  playerClass: CharacterClass | null;
  selectedSkills: Skill[];
  difficulty: Difficulty;
  customSkills: Skill[];

  player: Fighter | null;
  enemy: Fighter | null;
  turnNumber: number;
  currentTurn: "player" | "enemy";
  battleLog: BattleLogEntry[];
  floatingDamages: FloatingDamage[];

  result: BattleResult | null;
}

interface BattleActions {
  setStep: (step: SetupStep) => void;
  setPlayerName: (name: string) => void;
  setPlayerClass: (cls: CharacterClass) => void;
  toggleSkill: (skill: Skill) => void;
  setDifficulty: (d: Difficulty) => void;
  addCustomSkill: (skill: Skill) => void;
  removeCustomSkill: (id: string) => void;

  startBattle: () => void;
  playerAction: (action: BattleAction) => void;
  removeFloatingDamage: (id: number) => void;

  goToSettings: () => void;
}

const initialState: BattleState = {
  phase: "settings",
  step: 1,
  playerName: "",
  playerClass: null,
  selectedSkills: [],
  difficulty: "normal",
  customSkills: [],
  player: null,
  enemy: null,
  turnNumber: 1,
  currentTurn: "player",
  battleLog: [],
  floatingDamages: [],
  result: null,
};

export const useBattleStore = create<BattleState & BattleActions>(
  (set, get) => ({
    ...initialState,

    setStep: (step) => set({ step }),

    setPlayerName: (name) => set({ playerName: name }),

    setPlayerClass: (cls) => {
      set({ playerClass: cls, selectedSkills: [], customSkills: [] });
    },

    toggleSkill: (skill) => {
      const { selectedSkills } = get();
      const exists = selectedSkills.some((s) => s.id === skill.id);

      if (exists) {
        set({ selectedSkills: selectedSkills.filter((s) => s.id !== skill.id) });
      } else if (selectedSkills.length < 3) {
        set({ selectedSkills: [...selectedSkills, skill] });
      }
    },

    setDifficulty: (d) => set({ difficulty: d }),

    addCustomSkill: (skill) => {
      set((s) => ({ customSkills: [...s.customSkills, skill] }));
    },

    removeCustomSkill: (id) => {
      set((s) => ({
        customSkills: s.customSkills.filter((sk) => sk.id !== id),
        selectedSkills: s.selectedSkills.filter((sk) => sk.id !== id),
      }));
    },

    startBattle: () => {
      const { playerName, playerClass, selectedSkills, difficulty } = get();
      if (!playerClass || selectedSkills.length !== 3 || !playerName.trim()) return;

      const name = playerName.trim();
      const stats = { ...CLASS_DATA[playerClass].stats };
      const player: Fighter = {
        name,
        characterClass: playerClass,
        baseStats: stats,
        currentHP: stats.HP,
        currentMP: stats.MP,
        maxHP: stats.HP,
        maxMP: stats.MP,
        skills: selectedSkills,
        buffs: [],
        debuffs: [],
        isDefending: false,
      };

      const enemy = createAIFighter(playerClass, difficulty);
      const first = determineFirstAttacker(player, enemy);

      set({
        phase: "battle",
        player,
        enemy,
        turnNumber: 1,
        currentTurn: first,
        battleLog: [
          { turn: 1, message: `전투 시작! ${name} vs ${enemy.name}`, type: "system" },
          { turn: 1, message: `${first === "player" ? name : enemy.name}이(가) 선공!`, type: "system" },
        ],
        floatingDamages: [],
        result: null,
      });
    },

    playerAction: (action) => {
      const state = get();
      if (state.result) return;

      const { player, enemy, turnNumber, currentTurn, battleLog, difficulty } = state;
      if (!player || !enemy) return;

      // Reset defend at start of round
      let p = { ...player, isDefending: false };
      let e = { ...enemy, isDefending: false };
      const newLogs = [...battleLog];
      const newFloatings: FloatingDamage[] = [];

      const firstAttacker = currentTurn;
      const secondAttacker = firstAttacker === "player" ? "enemy" : "player";

      // --- First attacker's turn ---
      const firstAction = firstAttacker === "player"
        ? action
        : getAIAction(e, p, difficulty);

      const first = processOneFighterTurn(firstAttacker, p, e, firstAction, turnNumber);
      p = first.player;
      e = first.enemy;
      newLogs.push(...first.logs);
      if (first.floating) newFloatings.push(first.floating);

      if (first.gameOver) {
        set({
          player: p, enemy: e, battleLog: newLogs,
          floatingDamages: newFloatings,
          result: first.gameOver, phase: "result",
        });
        return;
      }

      // --- Second attacker's turn ---
      const secondAction = secondAttacker === "player"
        ? action
        : getAIAction(e, p, difficulty);

      const second = processOneFighterTurn(secondAttacker, p, e, secondAction, turnNumber);
      p = second.player;
      e = second.enemy;
      newLogs.push(...second.logs);
      if (second.floating) newFloatings.push(second.floating);

      if (second.gameOver) {
        set({
          player: p, enemy: e, battleLog: newLogs,
          floatingDamages: newFloatings,
          result: second.gameOver, phase: "result",
        });
        return;
      }

      // --- Max turn check ---
      const nextTurn = turnNumber + 1;
      if (nextTurn > MAX_TURNS) {
        const winner = p.currentHP >= e.currentHP ? "player" : "enemy";
        set({
          player: p, enemy: e,
          battleLog: [
            ...newLogs,
            { turn: turnNumber, message: `${MAX_TURNS}턴 초과! 남은 HP가 높은 쪽이 승리!`, type: "system" },
          ],
          floatingDamages: newFloatings,
          result: {
            winner, totalTurns: turnNumber,
            playerRemainingHP: p.currentHP, enemyRemainingHP: e.currentHP,
          },
          phase: "result",
        });
        return;
      }

      // --- Advance to next turn ---
      set({
        player: p,
        enemy: e,
        turnNumber: nextTurn,
        currentTurn: determineFirstAttacker(p, e),
        battleLog: newLogs,
        floatingDamages: newFloatings,
      });
    },

    removeFloatingDamage: (id) => {
      set((s) => ({
        floatingDamages: s.floatingDamages.filter((f) => f.id !== id),
      }));
    },

    goToSettings: () => set({ ...initialState }),
  }),
);
