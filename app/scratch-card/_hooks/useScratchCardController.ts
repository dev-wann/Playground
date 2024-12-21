import { useEffect, useState } from "react";
import CanvasController from "../_utils/canvasController";
import { ScratchCardStatus } from "@/app/scratch-card/_constants";
import { determineWinningStatus } from "@/app/scratch-card/_utils";

export interface ScratchCardControls {
  startScratch: () => void;
  stopScratch: () => void;
  pauseScratch: () => void;
  checkAndRestartScratch: (event: React.MouseEvent<HTMLCanvasElement>) => void;
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

  const initScratchCard = (delay: number) => {
    setStatus(ScratchCardStatus.IDLE);
    setTimeout(() => setIsWinning(determineWinningStatus(probability)), delay);
    controller.init()?.then(() => {
      setStatus(ScratchCardStatus.READY);
    });
  };

  useEffect(() => {
    initScratchCard(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    status,
    threshold,
    probability,
    isWinning,
    controls: {
      startScratch: () => controller.startScratch(),
      stopScratch: () => controller.stopScratch(),
      checkAndRestartScratch: (event: React.MouseEvent<HTMLCanvasElement>) =>
        controller.checkAndRestartScratch(event),
      pauseScratch: () => controller.pauseScratch(),
      scratch,
      reset: () => initScratchCard(500),
      setThreshold,
      setProbability,
    },
  };
}
