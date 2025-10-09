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
        "h-90 w-160 select-none perspective-distant",
        "scale-95 transition-all duration-300 hover:scale-100",
        isCompleted && "scale-100",
        isLoading && "opacity-0",
      )}
    >
      <div
        className={cn(
          "relative h-full w-full transform-3d",
          isCompleted && "animate-card-flip",
        )}
      >
        {/* card front */}
        <div className="absolute inset-0 flex size-full flex-col items-center justify-center overflow-hidden rounded-xl backface-hidden">
          {isWinning ? <Win /> : <Lose />}
          <ScratchCover status={status} controls={controls} />
        </div>

        {/* card back */}
        <div className="bg-gradient-gold absolute inset-0 size-full rotate-y-180 overflow-hidden rounded-xl backface-hidden" />
      </div>
    </section>
  );
}

function Win() {
  return (
    <div className="absolute inset-0 flex size-full items-center justify-center bg-gray-800">
      <div className="m-auto flex gap-4">
        <div className="flex flex-col">
          <p className="text-4xl leading-snug font-bold text-white">
            PLAYGROUND
          </p>
          <p className="text-right text-2xl leading-none font-light text-white">
            gift card
          </p>
          <div className="grow" />
          <p className="text-[70px] leading-tight font-medium text-white">
            $ 1,000
          </p>
        </div>
        <Gift className="-mt-4 -mr-8 -mb-12 size-80" weight="light" />
      </div>
    </div>
  );
}

function Lose() {
  return (
    <div className="absolute inset-0 flex size-full flex-col items-center justify-center gap-4 bg-gray-800">
      <SmileyMelting className="size-40" weight="light" />
      <p className="text-4xl leading-snug font-light text-white">
        Maybe next time...
      </p>
    </div>
  );
}
