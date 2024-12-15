import { ScratchCardStatus } from "../_constants";
import { ScratchCardControls } from "../_hooks/useScratchCardController";
import ScratchCover from "./ScratchCover";

interface Props {
  status: ScratchCardStatus;
  isWinning: boolean;
  controls: ScratchCardControls;
}

export default function ScratchCard({ status, isWinning, controls }: Props) {
  return (
    <section className="relative flex h-[360px] w-[640px] cursor-pointer select-none flex-col items-center justify-center">
      {isWinning ? <Win /> : <Lose />}
      <ScratchCover status={status} controls={controls} />
    </section>
  );
}

function Win() {
  return (
    <div className="absolute inset-0 flex size-full flex-col items-center justify-center bg-gray-400">
      <p>You won!</p>
      <p>Congratulations</p>
    </div>
  );
}

function Lose() {
  return (
    <div className="absolute inset-0 flex size-full flex-col items-center justify-center bg-gray-400">
      <p>Maybe next time</p>
    </div>
  );
}
