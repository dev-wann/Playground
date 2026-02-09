import type { Cell, GameSettings, GameStatus, LoseReason } from "../_types";
import { create } from "zustand";
import {
  checkWin,
  createEmptyBoard,
  placeMines,
  revealAllMines,
  revealCell,
} from "../_utils/boardUtils";

interface GameState {
  settings: GameSettings;
  board: Cell[][];
  gameStatus: GameStatus;
  flagCount: number;
  elapsedTime: number;
  hitCell: { row: number; col: number } | null;
  loseReason: LoseReason | null;
}

interface GameActions {
  setSettings: (settings: GameSettings) => void;
  initGame: () => void;
  handleFirstClick: (row: number, col: number) => void;
  openCell: (row: number, col: number) => void;
  toggleFlag: (row: number, col: number) => void;
  resetGame: () => void;
  tick: () => void;
  goBackToSettings: () => void;
}

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  settings: { rows: 9, cols: 9, mines: 10, timeLimit: null },
  board: [],
  gameStatus: "idle",
  flagCount: 0,
  elapsedTime: 0,
  hitCell: null,
  loseReason: null,

  setSettings: (settings) => set({ settings }),

  initGame: () => {
    const { settings } = get();
    set({
      board: createEmptyBoard(settings.rows, settings.cols),
      gameStatus: "ready",
      flagCount: 0,
      elapsedTime: 0,
      hitCell: null,
      loseReason: null,
    });
  },

  handleFirstClick: (row, col) => {
    const { settings, board, gameStatus } = get();
    if (gameStatus !== "ready") return;

    const minedBoard = placeMines(board, settings.mines, row, col);
    const revealedBoard = revealCell(minedBoard, row, col);
    const won = checkWin(revealedBoard);

    set({
      board: revealedBoard,
      gameStatus: won ? "won" : "playing",
    });
  },

  openCell: (row, col) => {
    const { gameStatus, board } = get();
    if (gameStatus !== "playing") return;

    const cell = board[row][col];
    if (cell.isRevealed || cell.isFlagged) return;

    if (cell.isMine) {
      set({
        board: revealAllMines(board),
        gameStatus: "lost",
        hitCell: { row, col },
        loseReason: "mine",
      });
      return;
    }

    const newBoard = revealCell(board, row, col);
    const won = checkWin(newBoard);

    set({
      board: newBoard,
      gameStatus: won ? "won" : "playing",
    });
  },

  toggleFlag: (row, col) => {
    const { gameStatus, board, flagCount } = get();
    if (gameStatus !== "playing") return;

    const cell = board[row][col];
    if (cell.isRevealed) return;

    const toggled = { ...cell, isFlagged: !cell.isFlagged };
    const newBoard = board.map((rowArr, r) =>
      r !== row
        ? rowArr
        : rowArr.map((c, cIdx) => (cIdx === col ? toggled : c)),
    );

    set({
      board: newBoard,
      flagCount: cell.isFlagged ? flagCount - 1 : flagCount + 1,
    });
  },

  resetGame: () => {
    get().initGame();
  },

  tick: () => {
    const { elapsedTime, settings, gameStatus, board } = get();
    if (gameStatus !== "playing") return;

    const newTime = elapsedTime + 1;

    if (settings.timeLimit !== null && newTime >= settings.timeLimit) {
      set({
        board: revealAllMines(board),
        gameStatus: "lost",
        elapsedTime: newTime,
        loseReason: "timeout",
      });
      return;
    }

    set({ elapsedTime: newTime });
  },

  goBackToSettings: () => {
    set({ gameStatus: "idle" });
  },
}));
