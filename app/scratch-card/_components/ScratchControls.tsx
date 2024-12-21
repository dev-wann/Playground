import { ScratchCardControls } from "../_hooks/useScratchCardController";
import PercentageInput from "./PercentageInput";

interface Props {
  threshold: number;
  probability: number;
  controls: ScratchCardControls;
}

export default function ScratchControls({
  threshold,
  probability,
  controls,
}: Props) {
  const { setThreshold, setProbability, reset } = controls;

  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = +parseFloat(e.target.value).toFixed(2);
    const clampedValue = Math.min(Math.max(inputValue, 0), 100);
    setThreshold(clampedValue / 100);
  };

  const handleProbabilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = +parseFloat(e.target.value).toFixed(2);
    const clampedValue = Math.min(Math.max(inputValue, 0), 100);
    setProbability(clampedValue / 100);
  };

  return (
    <section className="flex gap-4">
      <PercentageInput
        label="Threshold"
        value={threshold}
        onChange={handleThresholdChange}
      />

      <PercentageInput
        label="Probability"
        value={probability}
        onChange={handleProbabilityChange}
      />

      <button className="btn btn-sm" onClick={reset}>
        Reset Scratch Card
      </button>
    </section>
  );
}
