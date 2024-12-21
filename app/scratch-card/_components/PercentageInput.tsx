interface Props {
  label: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function PercentageInput({ label, value, onChange }: Props) {
  return (
    <label className="input input-sm input-bordered flex items-center gap-2">
      <span className="text-base-content">{label}</span>
      <input
        className="w-12 grow text-right"
        type="number"
        value={String(value * 100)}
        onChange={onChange}
      />
      <span className="text-base-content">%</span>
    </label>
  );
}
