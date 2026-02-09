"use client";

import { cn } from "@/app/_utils";

interface ExitModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ExitModal({ onConfirm, onCancel }: ExitModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        className={cn(
          "flex w-80 flex-col gap-4 rounded-2xl p-6",
          "bg-slate-800 shadow-2xl",
          "border border-slate-700/50",
        )}
      >
        <h2 className="text-center text-lg font-bold text-slate-100">
          게임 종료
        </h2>
        <p className="text-center text-sm text-slate-400">
          게임을 종료하시겠습니까?
          <br />
          진행 상황이 사라집니다.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className={cn(
              "flex-1 cursor-pointer rounded-xl border-2 border-slate-600 py-2.5 text-sm font-bold text-slate-300 transition-all",
              "hover:border-slate-500 hover:bg-slate-700",
            )}
          >
            계속하기
          </button>
          <button
            onClick={onConfirm}
            className={cn(
              "flex-1 cursor-pointer rounded-xl py-2.5 text-sm font-bold text-white transition-all",
              "bg-red-500 hover:bg-red-600",
            )}
          >
            나가기
          </button>
        </div>
      </div>
    </div>
  );
}
