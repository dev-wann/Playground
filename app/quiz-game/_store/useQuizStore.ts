import type {
  Category,
  Difficulty,
  OptionIndex,
  Phase,
  Question,
  QuestionResult,
  QuizSettings,
} from "../_types";
import { create } from "zustand";
import { DIFFICULTY_CONFIG, HINT_HIDE_COUNT } from "../_constants";
import { QUESTION_POOL } from "../_constants/questions";

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

function buildQuestions(
  categories: Category[],
  difficulty: Difficulty,
  count: number,
): Question[] {
  const pool: Question[] = [];

  for (const cat of categories) {
    pool.push(...QUESTION_POOL[cat][difficulty]);
  }

  return shuffle(pool).slice(0, Math.min(count, pool.length));
}

interface QuizState {
  phase: Phase;
  settings: QuizSettings;
  questions: Question[];
  currentIndex: number;
  score: number;
  results: QuestionResult[];
  selectedAnswer: OptionIndex | null;
  hintUsed: boolean;
  hiddenOptions: number[];
  timeRemaining: number;
  answered: boolean;
}

interface QuizActions {
  setPhase: (phase: Phase) => void;
  startGame: (settings: QuizSettings) => void;
  selectAnswer: (index: OptionIndex) => void;
  useHint: () => void;
  nextQuestion: () => void;
  handleTimeout: () => void;
  tick: () => void;
  resetToSettings: () => void;
  restartWithSameSettings: () => void;
}

export const useQuizStore = create<QuizState & QuizActions>((set, get) => ({
  phase: "settings",
  settings: {
    categories: [],
    difficulty: "normal",
    questionCount: 10,
    timeLimit: 30,
    hintEnabled: false,
  },
  questions: [],
  currentIndex: 0,
  score: 0,
  results: [],
  selectedAnswer: null,
  hintUsed: false,
  hiddenOptions: [],
  timeRemaining: 0,
  answered: false,

  setPhase: (phase) => set({ phase }),

  startGame: (settings) => {
    const questions = buildQuestions(
      settings.categories,
      settings.difficulty,
      settings.questionCount,
    );
    set({
      phase: "game",
      settings,
      questions,
      currentIndex: 0,
      score: 0,
      results: [],
      selectedAnswer: null,
      hintUsed: false,
      hiddenOptions: [],
      timeRemaining: settings.timeLimit,
      answered: false,
    });
  },

  selectAnswer: (index) => {
    const {
      questions,
      currentIndex,
      settings,
      hintUsed,
      timeRemaining,
      answered,
    } = get();

    if (answered) return;

    // 먼저 answered를 true로 설정하여 더블클릭 방지
    set({ answered: true, selectedAnswer: index });

    const question = questions[currentIndex];
    const isCorrect = index === question.answer;
    const { baseScore } = DIFFICULTY_CONFIG[settings.difficulty];
    const timeBonus = Math.round((timeRemaining / settings.timeLimit) * 50);
    let questionScore = isCorrect ? baseScore + timeBonus : 0;

    if (hintUsed) questionScore = Math.round(questionScore * 0.5);

    const result: QuestionResult = {
      question,
      selectedAnswer: index,
      isCorrect,
      isTimeout: false,
      hintUsed,
      score: questionScore,
      timeSpent: settings.timeLimit - timeRemaining,
    };

    set((s) => ({
      score: s.score + questionScore,
      results: [...s.results, result],
    }));
  },

  useHint: () => {
    const { questions, currentIndex, hintUsed, answered } = get();
    if (hintUsed || answered) return;

    const question = questions[currentIndex];
    const wrongIndices = [0, 1, 2, 3].filter((i) => i !== question.answer);
    const toHide = shuffle(wrongIndices).slice(0, HINT_HIDE_COUNT);

    set({ hintUsed: true, hiddenOptions: toHide });
  },

  nextQuestion: () => {
    const { currentIndex, questions, settings } = get();
    const nextIdx = currentIndex + 1;

    if (nextIdx >= questions.length) {
      set({ phase: "result" });
    } else {
      set({
        currentIndex: nextIdx,
        selectedAnswer: null,
        hintUsed: false,
        hiddenOptions: [],
        timeRemaining: settings.timeLimit,
        answered: false,
      });
    }
  },

  handleTimeout: () => {
    const { questions, currentIndex, hintUsed, settings, answered } = get();
    if (answered) return;

    const question = questions[currentIndex];
    const result: QuestionResult = {
      question,
      selectedAnswer: null,
      isCorrect: false,
      isTimeout: true,
      hintUsed,
      score: 0,
      timeSpent: settings.timeLimit,
    };

    set((s) => ({
      answered: true,
      timeRemaining: 0,
      results: [...s.results, result],
    }));
  },

  tick: () => {
    const { timeRemaining, answered } = get();
    if (answered || timeRemaining <= 0) return;
    const next = timeRemaining - 1;

    if (next <= 0) {
      get().handleTimeout();
    } else {
      set({ timeRemaining: next });
    }
  },

  resetToSettings: () => {
    set({
      phase: "settings",
      questions: [],
      currentIndex: 0,
      score: 0,
      results: [],
      selectedAnswer: null,
      hintUsed: false,
      hiddenOptions: [],
      timeRemaining: 0,
      answered: false,
    });
  },

  restartWithSameSettings: () => {
    const { settings } = get();
    get().startGame(settings);
  },
}));
