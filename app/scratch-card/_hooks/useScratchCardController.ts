import { useEffect, useState } from "react";
import CanvasController from "../_utils/canvasController";
import { ScratchCardStatus } from "@/app/scratch-card/_constants";
import { determineWinningStatus } from "@/app/scratch-card/_utils";

export interface ScratchCardControls {
  startScratch: () => void;
  stopScratch: () => void;
  scratch: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  reset: () => void;
  setThreshold: (threshold: number) => void;
  setProbability: (probability: number) => void;
}

export function useScratchCardController() {
  const [controller] = useState(new CanvasController());
  const [status, setStatus] = useState(ScratchCardStatus.IDLE);
  const [threshold, setThreshold] = useState(0.5);
  const [probability, setProbability] = useState(0.5);
  const [isWinning, setIsWinning] = useState(false);

  const scratch = (event: React.MouseEvent<HTMLCanvasElement>) => {
    controller.scratch(event);
    const progress = controller.calculateProgress();
    if (progress < threshold) return;
    setStatus(ScratchCardStatus.COMPLETED);
  };

  const reset = () => {
    setStatus(ScratchCardStatus.IDLE);
    setIsWinning(determineWinningStatus(probability));
    controller.init()?.then(() => {
      setStatus(ScratchCardStatus.READY);
    });
  };

  useEffect(() => {
    reset();
  }, []);

  return {
    status,
    threshold,
    probability,
    isWinning,
    controls: {
      startScratch: () => controller.startScratch(),
      stopScratch: () => controller.stopScratch(),
      scratch,
      reset,
      setThreshold,
      setProbability,
    },
  };
}
