import type { QuizSettings } from "../_types";
import { beforeEach, describe, expect, it } from "vitest";
import { useQuizStore } from "./useQuizStore";

const DEFAULT_SETTINGS: QuizSettings = {
  categories: ["general"],
  difficulty: "normal",
  questionCount: 5,
  timeLimit: 30,
  hintEnabled: true,
};

function startGame(overrides?: Partial<QuizSettings>) {
  useQuizStore.getState().startGame({ ...DEFAULT_SETTINGS, ...overrides });
}

function resetStore() {
  useQuizStore.getState().resetToSettings();
}

describe("useQuizStore", () => {
  beforeEach(() => {
    resetStore();
  });

  describe("startGame", () => {
    it("transitions to game phase and builds questions", () => {
      startGame();

      const state = useQuizStore.getState();
      expect(state.phase).toBe("game");
      expect(state.questions.length).toBeGreaterThan(0);
      expect(state.questions.length).toBeLessThanOrEqual(5);
      expect(state.currentIndex).toBe(0);
      expect(state.score).toBe(0);
      expect(state.timeRemaining).toBe(30);
      expect(state.answered).toBe(false);
    });

    it("respects question count limit", () => {
      startGame({ questionCount: 3 });

      const state = useQuizStore.getState();
      expect(state.questions.length).toBeLessThanOrEqual(3);
    });

    it("builds questions from multiple categories", () => {
      startGame({ categories: ["general", "science"], questionCount: 10 });

      const state = useQuizStore.getState();
      expect(state.questions.length).toBe(10);
    });

    it("clamps to pool size when count exceeds available questions", () => {
      startGame({ categories: ["general"], questionCount: 20 });

      const state = useQuizStore.getState();
      expect(state.questions.length).toBeLessThanOrEqual(5);
    });
  });

  describe("selectAnswer", () => {
    it("scores correctly for right answer", () => {
      startGame();

      const { questions } = useQuizStore.getState();
      const correctIdx = questions[0].answer;
      useQuizStore.getState().selectAnswer(correctIdx);

      const state = useQuizStore.getState();
      expect(state.answered).toBe(true);
      expect(state.selectedAnswer).toBe(correctIdx);
      expect(state.score).toBeGreaterThan(0);
      expect(state.results).toHaveLength(1);
      expect(state.results[0].isCorrect).toBe(true);
    });

    it("gives zero score for wrong answer", () => {
      startGame();

      const { questions } = useQuizStore.getState();
      const wrongIdx = questions[0].answer === 0 ? 1 : 0;
      useQuizStore.getState().selectAnswer(wrongIdx as 0 | 1 | 2 | 3);

      const state = useQuizStore.getState();
      expect(state.answered).toBe(true);
      expect(state.score).toBe(0);
      expect(state.results[0].isCorrect).toBe(false);
    });

    it("ignores duplicate calls when already answered", () => {
      startGame();

      const { questions } = useQuizStore.getState();
      const correctIdx = questions[0].answer;
      const wrongIdx =
        correctIdx === 0 ? 1 : ((correctIdx - 1) as 0 | 1 | 2 | 3);

      useQuizStore.getState().selectAnswer(correctIdx);
      const scoreAfterFirst = useQuizStore.getState().score;

      useQuizStore.getState().selectAnswer(wrongIdx);

      const state = useQuizStore.getState();
      expect(state.score).toBe(scoreAfterFirst);
      expect(state.results).toHaveLength(1);
      expect(state.selectedAnswer).toBe(correctIdx);
    });

    it("applies hint penalty (50%)", () => {
      startGame();

      useQuizStore.getState().useHint();

      const { questions } = useQuizStore.getState();
      const correctIdx = questions[0].answer;
      useQuizStore.getState().selectAnswer(correctIdx);

      const stateWithHint = useQuizStore.getState();

      resetStore();
      startGame();
      useQuizStore.setState({
        timeRemaining: stateWithHint.settings.timeLimit,
      });

      const { questions: q2 } = useQuizStore.getState();
      useQuizStore.getState().selectAnswer(q2[0].answer);

      const stateWithoutHint = useQuizStore.getState();

      expect(stateWithHint.results[0].score).toBeLessThan(
        stateWithoutHint.results[0].score,
      );
    });
  });

  describe("useHint", () => {
    it("hides exactly 2 wrong options", () => {
      startGame();
      useQuizStore.getState().useHint();

      const state = useQuizStore.getState();
      expect(state.hintUsed).toBe(true);
      expect(state.hiddenOptions).toHaveLength(2);

      const correctAnswer = state.questions[0].answer;
      expect(state.hiddenOptions).not.toContain(correctAnswer);
    });

    it("cannot be used twice", () => {
      startGame();
      useQuizStore.getState().useHint();

      const firstHidden = [...useQuizStore.getState().hiddenOptions];
      useQuizStore.getState().useHint();

      expect(useQuizStore.getState().hiddenOptions).toEqual(firstHidden);
    });

    it("cannot be used after answering", () => {
      startGame();

      const { questions } = useQuizStore.getState();
      useQuizStore.getState().selectAnswer(questions[0].answer);
      useQuizStore.getState().useHint();

      expect(useQuizStore.getState().hintUsed).toBe(false);
    });
  });

  describe("nextQuestion", () => {
    it("advances to next question and resets per-question state", () => {
      startGame();

      const { questions } = useQuizStore.getState();
      useQuizStore.getState().selectAnswer(questions[0].answer);
      useQuizStore.getState().nextQuestion();

      const state = useQuizStore.getState();
      expect(state.currentIndex).toBe(1);
      expect(state.selectedAnswer).toBeNull();
      expect(state.hintUsed).toBe(false);
      expect(state.hiddenOptions).toEqual([]);
      expect(state.answered).toBe(false);
      expect(state.timeRemaining).toBe(30);
    });

    it("transitions to result when all questions answered", () => {
      startGame({ questionCount: 1 });

      const { questions } = useQuizStore.getState();
      useQuizStore.getState().selectAnswer(questions[0].answer);
      useQuizStore.getState().nextQuestion();

      expect(useQuizStore.getState().phase).toBe("result");
    });
  });

  describe("tick", () => {
    it("decrements timeRemaining", () => {
      startGame();
      useQuizStore.getState().tick();

      expect(useQuizStore.getState().timeRemaining).toBe(29);
    });

    it("triggers timeout when time runs out", () => {
      startGame({ timeLimit: 2 });
      useQuizStore.getState().tick();

      expect(useQuizStore.getState().timeRemaining).toBe(1);
      expect(useQuizStore.getState().answered).toBe(false);

      useQuizStore.getState().tick();

      const state = useQuizStore.getState();
      expect(state.answered).toBe(true);
      expect(state.timeRemaining).toBe(0);
      expect(state.results).toHaveLength(1);
      expect(state.results[0].isTimeout).toBe(true);
      expect(state.results[0].score).toBe(0);
    });

    it("does nothing when already answered", () => {
      startGame();

      const { questions } = useQuizStore.getState();
      useQuizStore.getState().selectAnswer(questions[0].answer);
      useQuizStore.getState().tick();

      expect(useQuizStore.getState().timeRemaining).toBe(30);
    });

    it("does nothing when time is already 0", () => {
      startGame({ timeLimit: 1 });
      useQuizStore.getState().tick();

      expect(useQuizStore.getState().answered).toBe(true);

      useQuizStore.getState().tick();
      expect(useQuizStore.getState().results).toHaveLength(1);
    });
  });

  describe("handleTimeout", () => {
    it("marks as answered with timeout result", () => {
      startGame();
      useQuizStore.getState().handleTimeout();

      const state = useQuizStore.getState();
      expect(state.answered).toBe(true);
      expect(state.timeRemaining).toBe(0);
      expect(state.results[0].isTimeout).toBe(true);
      expect(state.results[0].selectedAnswer).toBeNull();
    });

    it("does nothing if already answered", () => {
      startGame();

      const { questions } = useQuizStore.getState();
      useQuizStore.getState().selectAnswer(questions[0].answer);
      useQuizStore.getState().handleTimeout();

      expect(useQuizStore.getState().results).toHaveLength(1);
      expect(useQuizStore.getState().results[0].isTimeout).toBe(false);
    });
  });

  describe("resetToSettings", () => {
    it("resets all state to initial values", () => {
      startGame();

      const { questions } = useQuizStore.getState();
      useQuizStore.getState().selectAnswer(questions[0].answer);
      useQuizStore.getState().resetToSettings();

      const state = useQuizStore.getState();
      expect(state.phase).toBe("settings");
      expect(state.questions).toEqual([]);
      expect(state.currentIndex).toBe(0);
      expect(state.score).toBe(0);
      expect(state.results).toEqual([]);
      expect(state.answered).toBe(false);
    });
  });

  describe("restartWithSameSettings", () => {
    it("starts a new game with same settings", () => {
      startGame();

      const { questions } = useQuizStore.getState();
      useQuizStore.getState().selectAnswer(questions[0].answer);
      const settingsBefore = useQuizStore.getState().settings;

      useQuizStore.getState().restartWithSameSettings();

      const state = useQuizStore.getState();
      expect(state.phase).toBe("game");
      expect(state.settings).toEqual(settingsBefore);
      expect(state.currentIndex).toBe(0);
      expect(state.score).toBe(0);
      expect(state.results).toEqual([]);
    });
  });
});
