"use client";

import ScratchCard from "./_components/ScratchCard";
import ScratchControls from "./_components/ScratchControls";
import { useScratchCardController } from "./_hooks/useScratchCardController";
import Instruction from "@/app/_components/Instruction";

export default function ScratchCardPage() {
  const { status, threshold, probability, isWinning, controls } =
    useScratchCardController();

  return (
    <main className="flex flex-col items-center">
      <Instruction instructions={["aaa", "bbb", "ccc"]} />
      <div className="flex flex-col items-center gap-8 p-12">
        <ScratchControls
          threshold={threshold}
          probability={probability}
          controls={controls}
        />
        <ScratchCard
          status={status}
          isWinning={isWinning}
          controls={controls}
        />
      </div>
    </main>
  );
}
