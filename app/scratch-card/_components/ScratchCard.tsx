import { ScratchCardStatus } from "../_constants";
import { ScratchCardControls } from "../_hooks/useScratchCardController";
import ScratchCover from "./ScratchCover";
import { cn } from "@/app/_utils";

interface Props {
  status: ScratchCardStatus;
  isWinning: boolean;
  controls: ScratchCardControls;
}

export default function ScratchCard({ status, isWinning, controls }: Props) {
  const isLoading = status === ScratchCardStatus.IDLE;
  const isCompleted = status === ScratchCardStatus.COMPLETED;

  return (
    <section
      className={cn(
        "relative h-[360px] w-[640px] select-none [perspective:1000px] [transform-style:preserve-3d]",
        "scale-95 transition-transform duration-300 hover:scale-100",
        isCompleted && "scale-100",
        isLoading && "opacity-0",
      )}
    >
      {/* card front */}
      <div
        className={cn(
          "absolute inset-0 flex size-full flex-col items-center justify-center overflow-hidden rounded-xl [backface-visibility:hidden]",
          isCompleted && "animate-card-flip-front",
        )}
      >
        {isWinning ? <Win /> : <Lose />}
        <ScratchCover status={status} controls={controls} />
      </div>

      {/* card back */}
      <div
        className={cn(
          "absolute inset-0 size-full overflow-hidden rounded-xl bg-gradient-gold [backface-visibility:hidden] [transform:rotateY(180deg)]",
          isCompleted && "animate-card-flip-back",
        )}
      />
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
