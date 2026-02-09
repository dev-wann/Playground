"use client";

import type { Category, Difficulty } from "../_types";
import { useState } from "react";
import { CATEGORIES, DIFFICULTY_CONFIG, getMaxQuestions } from "../_constants";
import { useQuizStore } from "../_store/useQuizStore";
import { cn } from "@/app/_utils";

const DIFFICULTIES: Difficulty[] = ["easy", "normal", "hard"];

export default function SettingsForm() {
  const startGame = useQuizStore((s) => s.startGame);

  const [categories, setCategories] = useState<Category[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");
  const [questionCount, setQuestionCount] = useState(10);
  const [timeLimit, setTimeLimit] = useState(30);
  const [hintEnabled, setHintEnabled] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const maxQuestions = categories.length > 0 ? getMaxQuestions(categories) : 20;
  const clampedCount = Math.min(questionCount, maxQuestions);

  const toggleCategory = (cat: Category) => {
    setCategories((prev) => {
      const next = prev.includes(cat)
        ? prev.filter((c) => c !== cat)
        : [...prev, cat];
      const nextMax = next.length > 0 ? getMaxQuestions(next) : 20;

      setQuestionCount((prev) => Math.min(prev, nextMax));

      return next;
    });
    setError(null);
  };

  const handleSubmit = () => {
    if (categories.length === 0) {
      setError("카테고리를 최소 1개 선택해주세요.");

      return;
    }

    startGame({
      categories,
      difficulty,
      questionCount: clampedCount,
      timeLimit,
      hintEnabled,
    });
  };

  return (
    <div className="w-full max-w-lg px-4">
      <h1 className="mb-6 text-center text-3xl font-bold text-slate-100">
        퀴즈 게임 🎯
      </h1>

      <div
        className={cn(
          "flex flex-col gap-6 rounded-2xl p-6",
          "bg-slate-800/80 shadow-lg backdrop-blur-md",
          "border border-slate-700/50",
        )}
      >
        {/* 카테고리 선택 */}
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-lg font-semibold text-slate-200">
            카테고리
          </legend>
          <div className="grid grid-cols-3 gap-2">
            {CATEGORIES.map((cat) => {
              const selected = categories.includes(cat.key);
              return (
                <button
                  key={cat.key}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => toggleCategory(cat.key)}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-xl px-3 py-3 text-sm font-medium transition-all",
                    "cursor-pointer border-2",
                    selected
                      ? "border-indigo-500 bg-indigo-500/20 text-indigo-300"
                      : "border-slate-600 text-slate-400 hover:border-slate-500 hover:bg-slate-700/50",
                  )}
                >
                  <span className="text-xl">{cat.emoji}</span>
                  <span>{cat.label}</span>
                  {selected && <span className="text-xs">✓</span>}
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* 난이도 선택 */}
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-lg font-semibold text-slate-200">
            난이도
          </legend>
          <div className="grid grid-cols-3 gap-2">
            {DIFFICULTIES.map((d) => {
              const config = DIFFICULTY_CONFIG[d];
              const selected = difficulty === d;
              return (
                <button
                  key={d}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setDifficulty(d)}
                  className={cn(
                    "cursor-pointer rounded-xl border-2 px-4 py-2 text-sm font-semibold transition-all",
                    selected ? config.activeColor : config.color,
                  )}
                >
                  {config.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* 문제 수 */}
        <div className="flex flex-col gap-2">
          <label className="flex items-center justify-between text-sm font-semibold text-slate-200">
            <span>문제 수</span>
            <span className="rounded-lg bg-slate-700 px-3 py-1 font-mono text-indigo-400">
              {clampedCount}문제
            </span>
          </label>
          <input
            type="range"
            min={1}
            max={Math.min(20, maxQuestions)}
            value={clampedCount}
            onChange={(e) => {
              setQuestionCount(Number(e.target.value));
              setError(null);
            }}
            aria-label="문제 수"
            className="range range-sm range-primary"
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>1</span>
            <span>{Math.min(20, maxQuestions)}</span>
          </div>
        </div>

        {/* 제한 시간 */}
        <div className="flex flex-col gap-2">
          <label className="flex items-center justify-between text-sm font-semibold text-slate-200">
            <span>문제당 제한시간</span>
            <span className="rounded-lg bg-slate-700 px-3 py-1 font-mono text-indigo-400">
              {timeLimit}초
            </span>
          </label>
          <input
            type="range"
            min={5}
            max={120}
            step={5}
            value={timeLimit}
            onChange={(e) => {
              setTimeLimit(Number(e.target.value));
              setError(null);
            }}
            aria-label="문제당 제한시간"
            className="range range-sm range-primary"
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>5초</span>
            <span>120초</span>
          </div>
        </div>

        {/* 힌트 토글 */}
        <label className="flex cursor-pointer items-center justify-between rounded-xl bg-slate-700/50 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-slate-200">힌트 사용</p>
            <p className="text-xs text-slate-400">
              오답 2개 제거, 점수 50% 감소
            </p>
          </div>
          <input
            type="checkbox"
            checked={hintEnabled}
            onChange={(e) => setHintEnabled(e.target.checked)}
            className="toggle toggle-sm toggle-primary"
          />
        </label>

        {/* 에러 */}
        {error && (
          <p className="rounded-lg bg-red-500/20 px-4 py-2 text-sm text-red-400">
            {error}
          </p>
        )}

        {/* 시작 버튼 */}
        <button
          type="button"
          onClick={handleSubmit}
          className={cn(
            "w-full cursor-pointer rounded-xl py-3 text-lg font-bold text-white transition-all",
            "bg-indigo-500 hover:bg-indigo-600",
            "shadow-lg shadow-indigo-500/25",
          )}
        >
          게임 시작
        </button>
      </div>
    </div>
  );
}
