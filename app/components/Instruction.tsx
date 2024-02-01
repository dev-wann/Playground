type Props = {
  instructions: string[];
};

export default function Instruction({ instructions }: Props) {
  return (
    <div className="w-4/5 max-w-fit m-auto mt-2 px-4 py-2 border-2 border-gray-400  bg-white bg-opacity-10">
      <h1 className="text-2xl font-bold mb-1">Instruction</h1>
      <ol className="list-decimal pl-5">
        {instructions.map((str) => (
          <li key={str}>{str}</li>
        ))}
      </ol>
    </div>
  );
}
