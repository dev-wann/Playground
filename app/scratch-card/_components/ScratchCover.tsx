import { ScratchCardStatus } from "../_constants";
import { ScratchCardControls } from "../_hooks/useScratchCardController";
import { cn } from "@/app/_utils";

interface Props {
  status: ScratchCardStatus;
  controls: ScratchCardControls;
}

export default function ScratchCover({ status, controls }: Props) {
  const {
    startScratch,
    stopScratch,
    pauseScratch,
    checkAndRestartScratch,
    scratch,
  } = controls;
  const isShowCover = status !== ScratchCardStatus.COMPLETED;

  return (
    <canvas
      id="scratch-card-canvas"
      className={cn(
        "absolute inset-0 size-full transition-opacity duration-500",
        isShowCover ? "opacity-100" : "opacity-0",
      )}
      onMouseDown={() => startScratch()}
      onMouseUp={() => stopScratch()}
      onMouseLeave={() => pauseScratch()}
      onMouseEnter={(e) => checkAndRestartScratch(e)}
      onMouseMove={(e) => scratch(e)}
    />
  );
}
