export function determineWinningStatus(probability: number) {
  return Math.random() <= probability;
}
