"use client";

import type { OptionIndex } from "../_types";
import { useCallback, useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/shallow";
import { OPTION_LABELS } from "../_constants";
import { useQuizStore } from "../_store/useQuizStore";
import ExitModal from "./ExitModal";
import { cn } from "@/app/_utils";

function getTimerColor(timePercent: number) {
  if (timePercent > 60) return "bg-green-500";
  if (timePercent > 30) return "bg-yellow-500";

  return "bg-red-500";
}

export default function GameView() {
  const {
    questions,
    currentIndex,
    score,
    settings,
    selectedAnswer,
    hintUsed,
    hiddenOptions,
    timeRemaining,
    answered,
  } = useQuizStore(
    useShallow((s) => ({
      questions: s.questions,
      currentIndex: s.currentIndex,
      score: s.score,
      settings: s.settings,
      selectedAnswer: s.selectedAnswer,
      hintUsed: s.hintUsed,
      hiddenOptions: s.hiddenOptions,
      timeRemaining: s.timeRemaining,
      answered: s.answered,
    })),
  );

  const [showExitModal, setShowExitModal] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (showExitModal) return;

    timerRef.current = setInterval(() => {
      useQuizStore.getState().tick();
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, showExitModal]);

  const handleExit = useCallback(() => setShowExitModal(true), []);

  const handleExitConfirm = useCallback(() => {
    setShowExitModal(false);
    useQuizStore.getState().resetToSettings();
  }, []);

  const handleExitCancel = useCallback(() => setShowExitModal(false), []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showExitModal) return;

      const state = useQuizStore.getState();

      if (!state.answered) {
        const keyMap: Record<string, OptionIndex> = {
          "1": 0,
          "2": 1,
          "3": 2,
          "4": 3,
        };
        const idx = keyMap[e.key];

        if (idx !== undefined && !state.hiddenOptions.includes(idx)) {
          state.selectAnswer(idx);
        }
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        state.nextQuestion();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showExitModal]);

  const question = questions[currentIndex];

  if (!question) return null;

  const progress = ((currentIndex + 1) / questions.length) * 100;
  const timePercent = (timeRemaining / settings.timeLimit) * 100;

  const getOptionStyle = (idx: number) => {
    if (!answered) {
      if (hiddenOptions.includes(idx)) {
        return "opacity-30 pointer-events-none border-slate-700 text-slate-600";
      }

      return "cursor-pointer border-slate-600 text-slate-200 hover:border-indigo-500 hover:bg-indigo-500/10";
    }

    if (idx === question.answer) {
      return "border-green-500 bg-green-500/20 text-green-300";
    }

    if (idx === selectedAnswer && idx !== question.answer) {
      return "border-red-500 bg-red-500/20 text-red-300";
    }

    return "border-slate-700 text-slate-500";
  };

  return (
    <>
    <div className="flex w-full max-w-lg flex-col gap-4 px-4">
      {/* 상단 바 */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleExit}
          className="cursor-pointer rounded-lg px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
        >
          ← 나가기
        </button>
        <div
          className="rounded-lg bg-slate-800/80 px-4 py-2 font-mono text-sm font-bold text-indigo-400 backdrop-blur-md"
          aria-live="polite"
        >
          {score}점
        </div>
      </div>

      {/* 게임 카드 */}
      <div
        className={cn(
          "flex flex-col gap-5 rounded-2xl p-6",
          "bg-slate-800/80 shadow-lg backdrop-blur-md",
          "border border-slate-700/50",
        )}
      >
        {/* 진행률 바 */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs text-slate-400">
            <span>
              {currentIndex + 1} / {questions.length}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div
            className="h-2 overflow-hidden rounded-full bg-slate-700"
            role="progressbar"
            aria-valuenow={currentIndex + 1}
            aria-valuemin={1}
            aria-valuemax={questions.length}
          >
            <div
              className="h-full rounded-full bg-indigo-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 타이머 바 */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs text-slate-400">
            <span>남은 시간</span>
            <span className="font-mono" aria-live="polite">
              {timeRemaining}초
            </span>
          </div>
          <div
            className="h-2 overflow-hidden rounded-full bg-slate-700"
            role="progressbar"
            aria-valuenow={timeRemaining}
            aria-valuemin={0}
            aria-valuemax={settings.timeLimit}
            aria-label="남은 시간"
          >
            <div
              className={cn(
                "h-full rounded-full transition-all duration-1000",
                getTimerColor(timePercent),
              )}
              style={{ width: `${timePercent}%` }}
            />
          </div>
        </div>

        {/* 문제 */}
        <div className="rounded-xl bg-slate-700/50 p-4">
          <p className="text-center text-lg leading-relaxed font-semibold text-slate-100">
            {question.q}
          </p>
        </div>

        {/* 선택지 2x2 */}
        <div
          className="grid grid-cols-2 gap-3"
          role="group"
          aria-label="답안 선택"
        >
          {question.options.map((opt, i) => {
            const idx = i as OptionIndex;

            return (
              <button
                key={`${currentIndex}-${idx}`}
                onClick={() =>
                  !answered && useQuizStore.getState().selectAnswer(idx)
                }
                disabled={answered || hiddenOptions.includes(idx)}
                aria-pressed={selectedAnswer === idx}
                className={cn(
                  "flex items-start gap-2 rounded-xl border-2 p-3 text-left text-sm font-medium transition-all",
                  getOptionStyle(idx),
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold",
                    answered && idx === question.answer
                      ? "bg-green-500 text-white"
                      : answered && idx === selectedAnswer
                        ? "bg-red-500 text-white"
                        : "bg-slate-600 text-slate-300",
                  )}
                >
                  {OPTION_LABELS[idx]}
                </span>
                <span className="leading-snug">{opt}</span>
              </button>
            );
          })}
        </div>

        {/* 하단 액션 */}
        <div className="flex items-center justify-between">
          {/* 힌트 버튼 */}
          {settings.hintEnabled && !answered ? (
            <button
              onClick={() => useQuizStore.getState().useHint()}
              disabled={hintUsed}
              className={cn(
                "cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition-all",
                hintUsed
                  ? "cursor-not-allowed bg-slate-700 text-slate-500"
                  : "border border-amber-500/50 bg-amber-500/20 text-amber-400 hover:bg-amber-500/30",
              )}
            >
              {hintUsed ? "힌트 사용됨" : "💡 힌트"}
            </button>
          ) : (
            <div />
          )}

          {/* 다음 문제 / 결과 보기 */}
          {answered && (
            <button
              onClick={() => useQuizStore.getState().nextQuestion()}
              className={cn(
                "cursor-pointer rounded-xl px-6 py-2 text-sm font-bold text-white transition-all",
                "bg-indigo-500 hover:bg-indigo-600",
                "shadow-lg shadow-indigo-500/25",
              )}
            >
              {currentIndex + 1 >= questions.length
                ? "결과 보기"
                : "다음 문제 →"}
            </button>
          )}
        </div>
      </div>
    </div>

    {showExitModal && (
      <ExitModal onConfirm={handleExitConfirm} onCancel={handleExitCancel} />
    )}
    </>
  );
}
