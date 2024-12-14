import { ScratchCardStatus } from "@/app/scratch-card/_constants";

interface Props {
  status: ScratchCardStatus;
  isWinning: boolean;
  scratch: () => void;
}

export default function ScratchCard({ status, isWinning, scratch }: Props) {
  return (
    <section
      className="flex size-40 cursor-pointer select-none flex-col items-center justify-center border border-gray-400"
      onMouseDown={scratch}
    >
      <p>{status}</p>
      <p>{isWinning ? "WIN" : "LOSE"}</p>
    </section>
  );
}
