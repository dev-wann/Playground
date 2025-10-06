import { cn } from "@/app/_utils";

interface Props {
  className?: string;
}

export default function Preview({ className }: Props) {
  return (
    <section className={cn(className, "space-y-4 rounded-lg bg-gray-800 p-4")}>
      Preview
    </section>
  );
}
