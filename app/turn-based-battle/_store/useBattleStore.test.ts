import { beforeEach, describe, expect, it } from "vitest";
import { CLASS_SKILLS } from "../_constants";
import type { Skill } from "../_types";
import { useBattleStore } from "./useBattleStore";

const warriorSkills = CLASS_SKILLS.warrior.slice(0, 3);

function resetStore() {
  useBattleStore.setState({
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
  });
}

function setupForBattle() {
  const store = useBattleStore.getState();
  store.setPlayerName("테스터");
  store.setPlayerClass("warrior");
  warriorSkills.forEach((skill) => store.toggleSkill(skill));
  store.setDifficulty("easy");
}

describe("useBattleStore", () => {
  beforeEach(() => {
    resetStore();
  });

  // --- Setup actions ---

  describe("setPlayerName", () => {
    it("updates the player name", () => {
      useBattleStore.getState().setPlayerName("용사");
      expect(useBattleStore.getState().playerName).toBe("용사");
    });
  });

  describe("setPlayerClass", () => {
    it("sets the class and resets skills", () => {
      const store = useBattleStore.getState();
      store.setPlayerClass("warrior");
      store.toggleSkill(warriorSkills[0]);

      expect(useBattleStore.getState().selectedSkills).toHaveLength(1);

      store.setPlayerClass("mage");
      const state = useBattleStore.getState();
      expect(state.playerClass).toBe("mage");
      expect(state.selectedSkills).toHaveLength(0);
      expect(state.customSkills).toHaveLength(0);
    });
  });

  describe("toggleSkill", () => {
    it("adds and removes a skill", () => {
      useBattleStore.getState().setPlayerClass("warrior");
      const skill = warriorSkills[0];

      useBattleStore.getState().toggleSkill(skill);
      expect(useBattleStore.getState().selectedSkills).toHaveLength(1);

      useBattleStore.getState().toggleSkill(skill);
      expect(useBattleStore.getState().selectedSkills).toHaveLength(0);
    });

    it("caps selection at 3 skills", () => {
      useBattleStore.getState().setPlayerClass("warrior");
      const skills = CLASS_SKILLS.warrior;

      skills.slice(0, 4).forEach((s) => useBattleStore.getState().toggleSkill(s));
      expect(useBattleStore.getState().selectedSkills).toHaveLength(3);
    });
  });

  describe("setStep", () => {
    it("changes the setup step", () => {
      useBattleStore.getState().setStep(2);
      expect(useBattleStore.getState().step).toBe(2);

      useBattleStore.getState().setStep(3);
      expect(useBattleStore.getState().step).toBe(3);
    });
  });

  describe("setDifficulty", () => {
    it("updates the difficulty", () => {
      useBattleStore.getState().setDifficulty("hard");
      expect(useBattleStore.getState().difficulty).toBe("hard");
    });
  });

  // --- Custom skills ---

  describe("addCustomSkill / removeCustomSkill", () => {
    const customSkill: Skill = {
      id: "custom_1",
      name: "커스텀",
      type: "attack",
      mpCost: 10,
      multiplier: 1.5,
      isCustom: true,
    };

    it("adds a custom skill", () => {
      useBattleStore.getState().addCustomSkill(customSkill);
      expect(useBattleStore.getState().customSkills).toHaveLength(1);
    });

    it("removes custom skill and deselects it", () => {
      const store = useBattleStore.getState();
      store.setPlayerClass("warrior");
      store.addCustomSkill(customSkill);
      store.toggleSkill(customSkill);

      expect(useBattleStore.getState().selectedSkills).toHaveLength(1);

      useBattleStore.getState().removeCustomSkill("custom_1");
      expect(useBattleStore.getState().customSkills).toHaveLength(0);
      expect(useBattleStore.getState().selectedSkills).toHaveLength(0);
    });
  });

  // --- Battle start ---

  describe("startBattle", () => {
    it("transitions to battle phase with valid setup", () => {
      setupForBattle();
      useBattleStore.getState().startBattle();

      const state = useBattleStore.getState();
      expect(state.phase).toBe("battle");
      expect(state.player).not.toBeNull();
      expect(state.enemy).not.toBeNull();
      expect(state.turnNumber).toBe(1);
      expect(state.battleLog.length).toBeGreaterThanOrEqual(2);
      expect(state.result).toBeNull();
    });

    it("does not start without a name", () => {
      const store = useBattleStore.getState();
      store.setPlayerClass("warrior");
      warriorSkills.forEach((s) => store.toggleSkill(s));

      store.startBattle();
      expect(useBattleStore.getState().phase).toBe("settings");
    });

    it("does not start without a class", () => {
      useBattleStore.getState().setPlayerName("테스터");
      useBattleStore.getState().startBattle();
      expect(useBattleStore.getState().phase).toBe("settings");
    });

    it("does not start with fewer than 3 skills", () => {
      const store = useBattleStore.getState();
      store.setPlayerName("테스터");
      store.setPlayerClass("warrior");
      store.toggleSkill(warriorSkills[0]);
      store.toggleSkill(warriorSkills[1]);

      store.startBattle();
      expect(useBattleStore.getState().phase).toBe("settings");
    });

    it("trims player name", () => {
      useBattleStore.getState().setPlayerName("  용사  ");
      useBattleStore.getState().setPlayerClass("warrior");
      warriorSkills.forEach((s) => useBattleStore.getState().toggleSkill(s));
      useBattleStore.getState().setDifficulty("easy");

      useBattleStore.getState().startBattle();
      expect(useBattleStore.getState().player!.name).toBe("용사");
    });

    it("creates an enemy with a different class", () => {
      setupForBattle();
      useBattleStore.getState().startBattle();

      const state = useBattleStore.getState();
      expect(state.enemy!.characterClass).not.toBe("warrior");
    });
  });

  // --- Player action ---

  describe("playerAction", () => {
    it("processes a turn and advances turn number", () => {
      setupForBattle();
      useBattleStore.getState().startBattle();

      const initialTurn = useBattleStore.getState().turnNumber;
      useBattleStore.getState().playerAction({ type: "attack" });

      const state = useBattleStore.getState();
      // Either turn advanced or game ended
      if (state.result) {
        expect(state.phase).toBe("result");
      } else {
        expect(state.turnNumber).toBe(initialTurn + 1);
      }
    });

    it("does nothing after battle is over", () => {
      setupForBattle();
      useBattleStore.getState().startBattle();

      // Force game over
      useBattleStore.setState({
        result: {
          winner: "player",
          totalTurns: 5,
          playerRemainingHP: 50,
          enemyRemainingHP: 0,
        },
      });

      const logsBefore = useBattleStore.getState().battleLog.length;
      useBattleStore.getState().playerAction({ type: "attack" });
      expect(useBattleStore.getState().battleLog.length).toBe(logsBefore);
    });

    it("does nothing without player/enemy", () => {
      useBattleStore.getState().playerAction({ type: "attack" });
      expect(useBattleStore.getState().turnNumber).toBe(1);
    });

    it("generates battle log entries", () => {
      setupForBattle();
      useBattleStore.getState().startBattle();

      const logsBefore = useBattleStore.getState().battleLog.length;
      useBattleStore.getState().playerAction({ type: "attack" });

      expect(useBattleStore.getState().battleLog.length).toBeGreaterThan(logsBefore);
    });

    it("defend action works", () => {
      setupForBattle();
      useBattleStore.getState().startBattle();

      useBattleStore.getState().playerAction({ type: "defend" });
      const state = useBattleStore.getState();

      const hasDefendLog = state.battleLog.some((log) => log.type === "defend");
      expect(hasDefendLog).toBe(true);
    });

    it("skill action consumes MP", () => {
      setupForBattle();
      useBattleStore.getState().startBattle();

      const mpBefore = useBattleStore.getState().player!.currentMP;
      const skill = useBattleStore.getState().player!.skills[0];

      useBattleStore.getState().playerAction({ type: "skill", skill });

      const state = useBattleStore.getState();
      // Player MP should have decreased (if player went first) or stayed same (if enemy went first and game ended)
      if (!state.result) {
        expect(state.player!.currentMP).toBeLessThan(mpBefore);
      }
    });

    it("eventually ends the battle", () => {
      setupForBattle();
      useBattleStore.getState().startBattle();

      for (let i = 0; i < 200; i++) {
        if (useBattleStore.getState().result) break;
        useBattleStore.getState().playerAction({ type: "attack" });
      }

      const state = useBattleStore.getState();
      expect(state.result).not.toBeNull();
      expect(state.phase).toBe("result");
      expect(state.result!.winner).toMatch(/^(player|enemy)$/);
    });
  });

  // --- removeFloatingDamage ---

  describe("removeFloatingDamage", () => {
    it("removes a floating damage by id", () => {
      useBattleStore.setState({
        floatingDamages: [
          { id: 1, target: "enemy", value: "-10", type: "damage" },
          { id: 2, target: "player", value: "-5", type: "damage" },
        ],
      });

      useBattleStore.getState().removeFloatingDamage(1);
      const remaining = useBattleStore.getState().floatingDamages;

      expect(remaining).toHaveLength(1);
      expect(remaining[0].id).toBe(2);
    });
  });

  // --- goToSettings ---

  describe("goToSettings", () => {
    it("resets everything back to initial state", () => {
      setupForBattle();
      useBattleStore.getState().startBattle();
      useBattleStore.getState().playerAction({ type: "attack" });

      useBattleStore.getState().goToSettings();

      const state = useBattleStore.getState();
      expect(state.phase).toBe("settings");
      expect(state.step).toBe(1);
      expect(state.player).toBeNull();
      expect(state.enemy).toBeNull();
      expect(state.battleLog).toHaveLength(0);
      expect(state.result).toBeNull();
    });
  });
});
