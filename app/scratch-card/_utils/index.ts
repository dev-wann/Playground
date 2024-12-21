import { ScratchStatusEnum } from "@/app/scratch-card/_constants";

export function determineWinningStatus(probability: number) {
  return Math.random() <= probability;
}