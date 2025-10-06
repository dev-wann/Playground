import { PixelBox } from "./PixelBox";
import { cn } from "@/app/_utils";

interface Props {
  className?: string;
}

export default function Preview({ className }: Props) {
  return (
    <section className={cn(className, "space-y-4 rounded-lg bg-gray-800 p-4")}>
      <PixelBox as="button" className="h-12 px-10">
        Pixel Button
      </PixelBox>
    </section>
  );
}
