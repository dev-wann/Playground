interface Props {
  probability: number;
  setProbability: (probability: number) => void;
  reset: () => void;
}

export default function ScratchControls({
  probability,
  setProbability,
  reset,
}: Props) {
  const handleProbabilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = +parseFloat(e.target.value).toFixed(2);
    const clampedValue = Math.min(Math.max(inputValue, 0), 100);
    setProbability(clampedValue / 100);
  };

  return (
    <section className="flex flex-col gap-4">
      <label className="input input-sm input-bordered flex items-center gap-2">
        <span className="text-base-content">Probability</span>
        <input
          className="w-12 grow text-right"
          type="number"
          value={probability * 100}
          onChange={handleProbabilityChange}
        />
        <span className="text-base-content">%</span>
      </label>

      <button className="btn btn-sm" onClick={reset}>
        Reset Scratch Card
      </button>
    </section>
  );
}
