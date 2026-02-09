"use client";

import { DIFFICULTY_CONFIG, getGrade, GRADE_CONFIG } from "../_constants";
import { useQuizStore } from "../_store/useQuizStore";
import { cn } from "@/app/_utils";

export default function ResultView() {
  const results = useQuizStore((s) => s.results);
  const score = useQuizStore((s) => s.score);
  const settings = useQuizStore((s) => s.settings);
  const resetToSettings = useQuizStore((s) => s.resetToSettings);
  const restartWithSameSettings = useQuizStore(
    (s) => s.restartWithSameSettings,
  );

  const totalQuestions = results.length;
  const correctCount = results.filter((r) => r.isCorrect).length;
  const accuracy =
    totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;

  const { baseScore } = DIFFICULTY_CONFIG[settings.difficulty];
  const maxPossible = totalQuestions * baseScore;
  const percent = maxPossible > 0 ? (score / maxPossible) * 100 : 0;
  const grade = getGrade(percent);
  const gradeConfig = GRADE_CONFIG[grade];

  return (
    <div className="flex w-full max-w-lg flex-col gap-4 px-4">
      <h1 className="text-center text-2xl font-bold text-slate-100">
        게임 결과
      </h1>

      {/* 등급 카드 */}
      <div
        className={cn(
          "flex flex-col items-center gap-4 rounded-2xl p-8",
          "bg-slate-800/80 shadow-lg backdrop-blur-md",
          "border border-slate-700/50",
        )}
      >
        {/* 등급 배지 */}
        <div
          className={cn(
            "flex h-24 w-24 items-center justify-center rounded-full text-4xl font-black",
            gradeConfig.bgColor,
            "text-white shadow-lg",
          )}
        >
          {grade}
        </div>

        {/* 점수 */}
        <div className="text-center">
          <p className="text-4xl font-bold text-slate-100">{score}점</p>
          <p className="mt-1 text-sm text-slate-400">최대 {maxPossible}점 중</p>
        </div>

        {/* 통계 */}
        <div className="grid w-full grid-cols-3 gap-3">
          <div className="rounded-xl bg-slate-700/50 p-3 text-center">
            <p className="text-2xl font-bold text-indigo-400">
              {correctCount}/{totalQuestions}
            </p>
            <p className="text-xs text-slate-400">정답 수</p>
          </div>
          <div className="rounded-xl bg-slate-700/50 p-3 text-center">
            <p className="text-2xl font-bold text-indigo-400">
              {accuracy.toFixed(0)}%
            </p>
            <p className="text-xs text-slate-400">정답률</p>
          </div>
          <div className="rounded-xl bg-slate-700/50 p-3 text-center">
            <p className={cn("text-2xl font-bold", gradeConfig.color)}>
              {grade}
            </p>
            <p className="text-xs text-slate-400">등급</p>
          </div>
        </div>
      </div>

      {/* 문항별 리뷰 */}
      <div
        className={cn(
          "flex flex-col gap-2 rounded-2xl p-4",
          "bg-slate-800/80 shadow-lg backdrop-blur-md",
          "border border-slate-700/50",
        )}
      >
        <h2 className="mb-2 text-lg font-semibold text-slate-200">
          문항별 리뷰
        </h2>
        {results.map((r, i) => (
          <div
            key={i}
            className={cn(
              "flex items-start gap-3 rounded-xl p-3",
              "bg-slate-700/30",
            )}
          >
            {/* 아이콘 */}
            <span className="mt-0.5 text-lg">
              {r.isTimeout ? "⏱" : r.isCorrect ? "✓" : "✗"}
            </span>
            {/* 내용 */}
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  "text-sm leading-snug font-medium",
                  r.isCorrect ? "text-green-300" : "text-red-300",
                )}
              >
                {r.question.q}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                {r.hintUsed && (
                  <span className="rounded bg-amber-500/20 px-2 py-0.5 text-amber-400">
                    힌트
                  </span>
                )}
                {r.isTimeout && (
                  <span className="rounded bg-red-500/20 px-2 py-0.5 text-red-400">
                    시간초과
                  </span>
                )}
                <span>+{r.score}점</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 버튼들 */}
      <div className="flex gap-3">
        <button
          onClick={resetToSettings}
          className={cn(
            "flex-1 cursor-pointer rounded-xl border-2 border-slate-600 py-3 text-sm font-bold text-slate-300 transition-all",
            "hover:border-slate-500 hover:bg-slate-800",
          )}
        >
          설정으로
        </button>
        <button
          onClick={restartWithSameSettings}
          className={cn(
            "flex-1 cursor-pointer rounded-xl py-3 text-sm font-bold text-white transition-all",
            "bg-indigo-500 hover:bg-indigo-600",
            "shadow-lg shadow-indigo-500/25",
          )}
        >
          다시 하기
        </button>
      </div>
    </div>
  );
}
