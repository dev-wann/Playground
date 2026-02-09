export type Category =
  | "general"
  | "science"
  | "history"
  | "geography"
  | "culture"
  | "it";

export type Difficulty = "easy" | "normal" | "hard";

export type OptionIndex = 0 | 1 | 2 | 3;

export interface Question {
  q: string;
  options: [string, string, string, string];
  answer: OptionIndex;
}

export interface CategoryInfo {
  key: Category;
  label: string;
  emoji: string;
}

export interface QuizSettings {
  categories: Category[];
  difficulty: Difficulty;
  questionCount: number;
  timeLimit: number;
  hintEnabled: boolean;
}

export interface QuestionResult {
  question: Question;
  selectedAnswer: OptionIndex | null;
  isCorrect: boolean;
  isTimeout: boolean;
  hintUsed: boolean;
  score: number;
  timeSpent: number;
}

export type Phase = "settings" | "game" | "result";

export type Grade = "S" | "A" | "B" | "C" | "D" | "F";
