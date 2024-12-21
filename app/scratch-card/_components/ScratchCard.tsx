import { Gift, SmileyMelting } from "@phosphor-icons/react";
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
    <div className="absolute inset-0 flex size-full items-center justify-center bg-gray-800">
      <div className="m-auto flex gap-4">
        <div className="flex flex-col">
          <p className="text-4xl font-bold leading-snug text-white">
            PLAYGROUND
          </p>
          <p className="text-right text-2xl font-light leading-none text-white">
            gift card
          </p>
          <div className="grow" />
          <p className="text-[70px] font-medium leading-tight text-white">
            $ 1,000
          </p>
        </div>
        <Gift className="-mb-12 -mr-8 -mt-4 size-80" weight="light" />
      </div>
    </div>
  );
}

function Lose() {
  return (
    <div className="absolute inset-0 flex size-full flex-col items-center justify-center gap-4 bg-gray-800">
      <SmileyMelting className="size-40" weight="light" />
      <p className="text-4xl font-light leading-snug text-white">
        Maybe next time...
      </p>
    </div>
  );
}
