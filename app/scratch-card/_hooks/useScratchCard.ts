import { useState } from "react";
import { ScratchCardStatus } from "@/app/scratch-card/_constants";
import { determineWinningStatus } from "@/app/scratch-card/_utils";

export default function useScratchCard(probability: number) {
  const [scratchStatus, setScratchStatus] = useState(ScratchCardStatus.IDLE);
  const [isWinning, setIsWinning] = useState(false);

  const scratch = () => {
    if (scratchStatus === ScratchCardStatus.IDLE) {
      setScratchStatus(ScratchCardStatus.PENDING);
      setIsWinning(determineWinningStatus(probability));
    }

    if (scratchStatus === ScratchCardStatus.PENDING) {
      // TODO. add scratch percentage lower bound condition
      setScratchStatus(ScratchCardStatus.COMPLETED);
    }
  };

  const reset = () => {
    setScratchStatus(ScratchCardStatus.IDLE);
    setIsWinning(false);
  };

  return { scratchStatus, isWinning, scratch, reset };
}
