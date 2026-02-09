import { beforeEach, describe, expect, it } from "vitest";
import { useGameStore } from "./useGameStore";

function resetStore() {
  useGameStore.setState({
    settings: { rows: 9, cols: 9, mines: 10, timeLimit: null },
    board: [],
    gameStatus: "idle",
    flagCount: 0,
    elapsedTime: 0,
    hitCell: null,
    loseReason: null,
  });
}

describe("useGameStore", () => {
  beforeEach(() => {
    resetStore();
  });

  describe("initGame", () => {
    it("creates an empty board and sets status to ready", () => {
      const { initGame } = useGameStore.getState();
      initGame();

      const state = useGameStore.getState();
      expect(state.gameStatus).toBe("ready");
      expect(state.board).toHaveLength(9);
      expect(state.board[0]).toHaveLength(9);
      expect(state.flagCount).toBe(0);
      expect(state.elapsedTime).toBe(0);
    });
  });

  describe("handleFirstClick", () => {
    it("places mines and transitions to playing", () => {
      const store = useGameStore.getState();
      store.initGame();
      store.handleFirstClick(4, 4);

      const state = useGameStore.getState();
      expect(state.gameStatus).toBe("playing");

      const mineCount = state.board.flat().filter((c) => c.isMine).length;
      expect(mineCount).toBe(10);
    });

    it("ensures first click cell is revealed", () => {
      const store = useGameStore.getState();
      store.initGame();
      store.handleFirstClick(4, 4);

      const state = useGameStore.getState();
      expect(state.board[4][4].isRevealed).toBe(true);
    });

    it("does nothing if not in ready state", () => {
      const store = useGameStore.getState();
      store.handleFirstClick(4, 4);

      const state = useGameStore.getState();
      expect(state.gameStatus).toBe("idle");
    });

    it("ignores duplicate calls", () => {
      const store = useGameStore.getState();
      store.initGame();
      store.handleFirstClick(4, 4);

      const boardAfterFirst = useGameStore.getState().board;
      store.handleFirstClick(0, 0);

      expect(useGameStore.getState().board).toBe(boardAfterFirst);
    });
  });

  describe("openCell", () => {
    it("reveals a safe cell", () => {
      const store = useGameStore.getState();
      store.initGame();
      store.handleFirstClick(0, 0);

      const state = useGameStore.getState();
      const safeCell = state.board
        .flat()
        .find((c) => !c.isMine && !c.isRevealed);

      if (safeCell) {
        store.openCell(safeCell.row, safeCell.col);
        expect(
          useGameStore.getState().board[safeCell.row][safeCell.col].isRevealed,
        ).toBe(true);
      }
    });

    it("triggers game over when mine is clicked", () => {
      const store = useGameStore.getState();
      store.initGame();
      store.handleFirstClick(0, 0);

      const state = useGameStore.getState();
      const mineCell = state.board.flat().find((c) => c.isMine);

      if (mineCell) {
        store.openCell(mineCell.row, mineCell.col);
        const after = useGameStore.getState();
        expect(after.gameStatus).toBe("lost");
        expect(after.loseReason).toBe("mine");
        expect(after.hitCell).toEqual({
          row: mineCell.row,
          col: mineCell.col,
        });
      }
    });

    it("does nothing if game is not playing", () => {
      const store = useGameStore.getState();
      store.initGame();

      store.openCell(0, 0);
      expect(useGameStore.getState().gameStatus).toBe("ready");
    });

    it("does not open flagged cells", () => {
      const store = useGameStore.getState();
      store.initGame();
      store.handleFirstClick(0, 0);

      const state = useGameStore.getState();
      const cell = state.board
        .flat()
        .find((c) => !c.isMine && !c.isRevealed);

      if (cell) {
        store.toggleFlag(cell.row, cell.col);
        store.openCell(cell.row, cell.col);
        expect(
          useGameStore.getState().board[cell.row][cell.col].isRevealed,
        ).toBe(false);
      }
    });
  });

  describe("toggleFlag", () => {
    it("flags and unflags a cell", () => {
      const store = useGameStore.getState();
      store.initGame();
      store.handleFirstClick(0, 0);

      const state = useGameStore.getState();
      const cell = state.board
        .flat()
        .find((c) => !c.isMine && !c.isRevealed);

      if (cell) {
        store.toggleFlag(cell.row, cell.col);
        expect(useGameStore.getState().flagCount).toBe(1);
        expect(
          useGameStore.getState().board[cell.row][cell.col].isFlagged,
        ).toBe(true);

        store.toggleFlag(cell.row, cell.col);
        expect(useGameStore.getState().flagCount).toBe(0);
        expect(
          useGameStore.getState().board[cell.row][cell.col].isFlagged,
        ).toBe(false);
      }
    });

    it("does nothing when game is not playing", () => {
      const store = useGameStore.getState();
      store.initGame();

      store.toggleFlag(0, 0);
      expect(useGameStore.getState().flagCount).toBe(0);
    });
  });

  describe("tick", () => {
    it("increments elapsed time", () => {
      const store = useGameStore.getState();
      store.initGame();
      store.handleFirstClick(0, 0);

      store.tick();
      expect(useGameStore.getState().elapsedTime).toBe(1);

      store.tick();
      expect(useGameStore.getState().elapsedTime).toBe(2);
    });

    it("triggers timeout loss when time limit reached", () => {
      useGameStore.setState({
        settings: { rows: 9, cols: 9, mines: 10, timeLimit: 3 },
      });

      const store = useGameStore.getState();
      store.initGame();
      store.handleFirstClick(0, 0);

      store.tick();
      store.tick();
      expect(useGameStore.getState().gameStatus).toBe("playing");

      store.tick();
      const state = useGameStore.getState();
      expect(state.gameStatus).toBe("lost");
      expect(state.loseReason).toBe("timeout");
      expect(state.elapsedTime).toBe(3);
    });

    it("does nothing when not playing", () => {
      const store = useGameStore.getState();
      store.initGame();

      store.tick();
      expect(useGameStore.getState().elapsedTime).toBe(0);
    });
  });

  describe("resetGame", () => {
    it("resets to ready state", () => {
      const store = useGameStore.getState();
      store.initGame();
      store.handleFirstClick(0, 0);
      store.tick();

      store.resetGame();
      const state = useGameStore.getState();
      expect(state.gameStatus).toBe("ready");
      expect(state.elapsedTime).toBe(0);
      expect(state.flagCount).toBe(0);
      expect(state.hitCell).toBeNull();
      expect(state.loseReason).toBeNull();
    });
  });

  describe("goBackToSettings", () => {
    it("transitions to idle", () => {
      const store = useGameStore.getState();
      store.initGame();
      store.handleFirstClick(0, 0);

      store.goBackToSettings();
      expect(useGameStore.getState().gameStatus).toBe("idle");
    });
  });
});
