import { Markup } from "interweave";
import { polyfill } from "interweave-ssr";

polyfill();

type Props = {
  instructions: string[];
};

export default function Instruction({ instructions }: Props) {
  return (
    <div className="m-auto mt-2 w-4/5 max-w-fit border-2 border-gray-400 bg-white/10 px-4 py-2">
      <h1 className="mb-1 text-2xl font-bold">Instruction</h1>
      <ol className="list-decimal pl-5">
        {instructions.map((str) => (
          <li key={str}>
            <Markup content={str} />
          </li>
        ))}
      </ol>
    </div>
  );
}
