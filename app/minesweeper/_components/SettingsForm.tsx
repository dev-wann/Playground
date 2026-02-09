"use client";

import type {
  Difficulty,
  PresetDifficulty,
  SettingsFormValues,
} from "../_types";
import { useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  COLS_MAX,
  COLS_MIN,
  DIFFICULTY_PRESETS,
  ROWS_MAX,
  ROWS_MIN,
} from "../_constants";
import { useGameStore } from "../_store/useGameStore";
import { cn } from "@/app/_utils";

const DIFFICULTY_OPTIONS: { value: Difficulty; label: string }[] = [
  { value: "beginner", label: "Beginner (9x9, 10 mines)" },
  { value: "intermediate", label: "Intermediate (16x16, 40 mines)" },
  { value: "expert", label: "Expert (16x30, 99 mines)" },
  { value: "custom", label: "Custom" },
];

function isPresetDifficulty(d: Difficulty): d is PresetDifficulty {
  return d !== "custom";
}

export default function SettingsForm() {
  const setSettings = useGameStore((s) => s.setSettings);
  const initGame = useGameStore((s) => s.initGame);

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    control,
    formState: { errors },
  } = useForm<SettingsFormValues>({
    defaultValues: {
      difficulty: "beginner",
      rows: 9,
      cols: 9,
      mines: 10,
      timeLimitEnabled: false,
      timeLimit: 300,
    },
    mode: "onChange",
  });

  const difficulty = useWatch({ control, name: "difficulty" });
  const rows = useWatch({ control, name: "rows" });
  const cols = useWatch({ control, name: "cols" });
  const mines = useWatch({ control, name: "mines" });
  const timeLimitEnabled = useWatch({ control, name: "timeLimitEnabled" });

  const isCustom = !isPresetDifficulty(difficulty);
  const preset = isCustom ? null : DIFFICULTY_PRESETS[difficulty];
  const displayRows = preset?.rows ?? rows;
  const displayCols = preset?.cols ?? cols;
  const displayMines = preset?.mines ?? mines;
  const maxMines = displayRows * displayCols - 9;
  const density =
    displayRows * displayCols > 0
      ? ((displayMines / (displayRows * displayCols)) * 100).toFixed(1)
      : "0.0";

  const maxMinesRef = useRef(maxMines);
  maxMinesRef.current = maxMines;

  useEffect(() => {
    if (isCustom) {
      trigger("mines");
    }
  }, [rows, cols, isCustom, trigger]);

  const handleDifficultyChange = (value: Difficulty) => {
    setValue("difficulty", value);

    if (isPresetDifficulty(value)) {
      const preset = DIFFICULTY_PRESETS[value];
      setValue("rows", preset.rows);
      setValue("cols", preset.cols);
      setValue("mines", preset.mines);
    }
  };

  const onSubmit = (data: SettingsFormValues) => {
    const preset = isPresetDifficulty(data.difficulty)
      ? DIFFICULTY_PRESETS[data.difficulty]
      : null;

    setSettings({
      rows: preset?.rows ?? data.rows,
      cols: preset?.cols ?? data.cols,
      mines: preset?.mines ?? data.mines,
      timeLimit: data.timeLimitEnabled ? data.timeLimit : null,
    });
    initGame();
  };

  return (
    <div className="w-full max-w-md px-4">
      <h1 className="mb-6 text-center text-3xl font-bold text-slate-100">
        Gotta mine &apos;em all!
      </h1>

      <form
        className={cn(
          "flex flex-col gap-6 rounded-2xl p-6",
          "bg-slate-800 shadow-lg",
        )}
        onSubmit={handleSubmit(onSubmit)}
      >
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-lg font-semibold text-slate-200">
            Difficulty
          </legend>
          {DIFFICULTY_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-lg px-4 py-2 transition-colors",
                difficulty === opt.value
                  ? "bg-red-500/20 text-red-400"
                  : "text-slate-300 hover:bg-slate-700",
              )}
            >
              <input
                type="radio"
                value={opt.value}
                className="accent-red-500"
                {...register("difficulty")}
                onChange={() => handleDifficultyChange(opt.value)}
              />
              <span className="text-sm">{opt.label}</span>
            </label>
          ))}
        </fieldset>

        {isCustom && (
          <div className="flex flex-col gap-4 rounded-lg bg-slate-700/50 p-4">
            <div>
              <label className="mb-1 block text-sm text-slate-300">
                Rows ({ROWS_MIN}~{ROWS_MAX})
              </label>
              <input
                type="number"
                className={cn(
                  "w-full rounded-lg border bg-slate-900 px-3 py-2 text-slate-100",
                  errors.rows ? "border-red-500" : "border-slate-600",
                )}
                {...register("rows", {
                  valueAsNumber: true,
                  min: { value: ROWS_MIN, message: `Minimum ${ROWS_MIN}` },
                  max: { value: ROWS_MAX, message: `Maximum ${ROWS_MAX}` },
                  required: "Required",
                })}
              />
              {errors.rows && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.rows.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm text-slate-300">
                Columns ({COLS_MIN}~{COLS_MAX})
              </label>
              <input
                type="number"
                className={cn(
                  "w-full rounded-lg border bg-slate-900 px-3 py-2 text-slate-100",
                  errors.cols ? "border-red-500" : "border-slate-600",
                )}
                {...register("cols", {
                  valueAsNumber: true,
                  min: { value: COLS_MIN, message: `Minimum ${COLS_MIN}` },
                  max: { value: COLS_MAX, message: `Maximum ${COLS_MAX}` },
                  required: "Required",
                })}
              />
              {errors.cols && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.cols.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm text-slate-300">
                Mines (1~{maxMines > 0 ? maxMines : 1})
              </label>
              <input
                type="number"
                className={cn(
                  "w-full rounded-lg border bg-slate-900 px-3 py-2 text-slate-100",
                  errors.mines ? "border-red-500" : "border-slate-600",
                )}
                {...register("mines", {
                  valueAsNumber: true,
                  min: { value: 1, message: "Minimum 1" },
                  validate: (value) =>
                    value <= maxMinesRef.current ||
                    `Maximum ${maxMinesRef.current} mines`,
                  required: "Required",
                })}
              />
              {errors.mines && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.mines.message}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <label className="flex cursor-pointer items-center gap-3 text-slate-200">
            <input
              type="checkbox"
              className="toggle toggle-sm toggle-error"
              {...register("timeLimitEnabled")}
            />
            <span className="text-sm">Time Limit</span>
          </label>

          {timeLimitEnabled && (
            <div>
              <label className="mb-1 block text-sm text-slate-300">
                Time Limit (seconds)
              </label>
              <input
                type="number"
                className={cn(
                  "w-full rounded-lg border bg-slate-900 px-3 py-2 text-slate-100",
                  errors.timeLimit ? "border-red-500" : "border-slate-600",
                )}
                {...register("timeLimit", {
                  valueAsNumber: true,
                  min: { value: 10, message: "Minimum 10 seconds" },
                  max: { value: 3600, message: "Maximum 3600 seconds" },
                  required: "Required",
                })}
              />
              {errors.timeLimit && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.timeLimit.message}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="rounded-lg bg-slate-700/50 p-4">
          <h3 className="mb-2 text-sm font-semibold text-slate-300">Summary</h3>
          <div className="flex flex-col gap-1 text-sm text-slate-400">
            <div className="flex justify-between">
              <span>Grid Size</span>
              <span className="text-slate-200">
                {displayRows} x {displayCols}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Mines</span>
              <span className="text-slate-200">{displayMines}</span>
            </div>
            <div className="flex justify-between">
              <span>Mine Density</span>
              <span className="text-slate-200">{density}%</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className={cn(
            "w-full rounded-lg py-3 text-lg font-bold text-white transition-colors",
            "bg-red-500 hover:bg-red-600",
            "disabled:cursor-not-allowed disabled:opacity-50",
          )}
        >
          Start Game
        </button>
      </form>
    </div>
  );
}
