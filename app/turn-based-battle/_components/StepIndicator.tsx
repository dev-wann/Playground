import { cn } from "../../_utils";
import type { SetupStep } from "../_types";

const STEPS: { num: SetupStep; label: string }[] = [
  { num: 1, label: "캐릭터" },
  { num: 2, label: "스킬" },
  { num: 3, label: "난이도" },
];

interface StepIndicatorProps {
  current: SetupStep;
}

export default function StepIndicator({ current }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      {STEPS.map((s, i) => (
        <div key={s.num} className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors",
                current === s.num
                  ? "bg-violet-500 text-white"
                  : current > s.num
                    ? "bg-violet-500/30 text-violet-300"
                    : "bg-slate-700 text-slate-500",
              )}
            >
              {current > s.num ? "✓" : s.num}
            </div>
            <span
              className={cn(
                "text-sm font-medium",
                current === s.num
                  ? "text-white"
                  : current > s.num
                    ? "text-violet-300"
                    : "text-slate-500",
              )}
            >
              {s.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={cn(
                "h-0.5 w-8",
                current > s.num ? "bg-violet-500/50" : "bg-slate-700",
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
