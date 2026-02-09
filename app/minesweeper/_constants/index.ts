import type { GameSettings, GameStatus, PresetDifficulty } from "../_types";

export const CELL_SIZE = 32;

export const DIFFICULTY_PRESETS: Record<PresetDifficulty, GameSettings> = {
  beginner: { rows: 9, cols: 9, mines: 10, timeLimit: null },
  intermediate: { rows: 16, cols: 16, mines: 40, timeLimit: null },
  expert: { rows: 16, cols: 30, mines: 99, timeLimit: null },
};

export const NUMBER_COLORS: Record<number, string> = {
  1: "text-blue-600 dark:text-blue-400",
  2: "text-green-600 dark:text-green-400",
  3: "text-red-600 dark:text-red-400",
  4: "text-purple-700 dark:text-purple-400",
  5: "text-amber-800 dark:text-amber-400",
  6: "text-cyan-600 dark:text-cyan-400",
  7: "text-gray-800 dark:text-gray-300",
  8: "text-gray-500 dark:text-gray-400",
};

export const ROWS_MIN = 5;
export const ROWS_MAX = 40;
export const COLS_MIN = 5;
export const COLS_MAX = 40;

export const STATUS_EMOJI: Record<GameStatus, string> = {
  idle: "😊",
  ready: "😊",
  playing: "😊",
  won: "😎",
  lost: "😵",
};
