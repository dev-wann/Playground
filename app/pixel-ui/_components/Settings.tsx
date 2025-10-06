import { cn } from "@/app/_utils";

interface Props {
  className?: string;
}

export default function Settings({ className }: Props) {
  return (
    <section className={cn(className, "rounded-lg bg-gray-800 p-4")}>
      Settings
    </section>
  );
}
