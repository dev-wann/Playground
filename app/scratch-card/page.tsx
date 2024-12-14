"use client";

import { useState } from "react";
import ScratchCard from "./_components/ScratchCard";
import ScratchControls from "./_components/ScratchControls";
import useScratchCard from "./_hooks/useScratchCard";
import Instruction from "@/app/_components/Instruction";

export default function ScratchCardPage() {
  const [probability, setProbability] = useState(0.5);
  const { scratchStatus, isWinning, scratch, reset } =
    useScratchCard(probability);

  return (
    <main className="flex flex-col items-center">
      <Instruction instructions={["aaa", "bbb", "ccc"]} />
      <div className="flex flex-col items-center gap-8 p-12">
        <ScratchControls
          probability={probability}
          setProbability={setProbability}
          reset={reset}
        />
        <ScratchCard
          status={scratchStatus}
          isWinning={isWinning}
          scratch={scratch}
        />
      </div>
    </main>
  );
}
