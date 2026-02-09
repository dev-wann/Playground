export type GameStatus = "idle" | "ready" | "playing" | "won" | "lost";

export type LoseReason = "mine" | "timeout";

export type Difficulty = "beginner" | "intermediate" | "expert" | "custom";

export type PresetDifficulty = Exclude<Difficulty, "custom">;

export interface GameSettings {
  rows: number;
  cols: number;
  mines: number;
  timeLimit: number | null;
}

export interface Cell {
  row: number;
  col: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;
}

export interface SettingsFormValues {
  difficulty: Difficulty;
  rows: number;
  cols: number;
  mines: number;
  timeLimitEnabled: boolean;
  timeLimit: number;
}
