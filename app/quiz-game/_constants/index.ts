import type { Category, CategoryInfo, Difficulty, Grade } from "../_types";

export const CATEGORIES: CategoryInfo[] = [
  { key: "general", label: "일반상식", emoji: "🧠" },
  { key: "science", label: "과학", emoji: "🔬" },
  { key: "history", label: "역사", emoji: "📜" },
  { key: "geography", label: "지리", emoji: "🌍" },
  { key: "culture", label: "문화/예술", emoji: "🎭" },
  { key: "it", label: "IT/기술", emoji: "💻" },
];

export const DIFFICULTY_CONFIG: Record<
  Difficulty,
  { label: string; baseScore: number; color: string; activeColor: string }
> = {
  easy: {
    label: "쉬움",
    baseScore: 100,
    color: "border-green-500 text-green-400",
    activeColor: "bg-green-500 text-white border-green-500",
  },
  normal: {
    label: "보통",
    baseScore: 200,
    color: "border-yellow-500 text-yellow-400",
    activeColor: "bg-yellow-500 text-white border-yellow-500",
  },
  hard: {
    label: "어려움",
    baseScore: 300,
    color: "border-red-500 text-red-400",
    activeColor: "bg-red-500 text-white border-red-500",
  },
};

export const GRADE_CONFIG: Record<
  Grade,
  { color: string; bgColor: string; minPercent: number }
> = {
  S: { color: "text-yellow-300", bgColor: "bg-yellow-500", minPercent: 95 },
  A: { color: "text-green-300", bgColor: "bg-green-500", minPercent: 80 },
  B: { color: "text-blue-300", bgColor: "bg-blue-500", minPercent: 65 },
  C: { color: "text-purple-300", bgColor: "bg-purple-500", minPercent: 50 },
  D: { color: "text-orange-300", bgColor: "bg-orange-500", minPercent: 30 },
  F: { color: "text-red-300", bgColor: "bg-red-500", minPercent: 0 },
};

export const OPTION_LABELS = ["A", "B", "C", "D"] as const;

export const MAX_QUESTIONS_PER_POOL = 5;

export const HINT_HIDE_COUNT = 2;

export function getMaxQuestions(categories: Category[]): number {
  return categories.length * MAX_QUESTIONS_PER_POOL;
}

const GRADE_ORDER: Grade[] = ["S", "A", "B", "C", "D", "F"];

export function getGrade(percent: number): Grade {
  for (const g of GRADE_ORDER) {
    if (percent >= GRADE_CONFIG[g].minPercent) return g;
  }

  return "F";
}
