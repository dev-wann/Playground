"use client";

import { useState } from "react";
import Preview from "./_components/Preview";
import Settings from "./_components/Settings";

export default function PixelUiPage() {
  const [settings, setSettings] = useState({
    pixelStep: 10,
    roundness: 2,
    backgroundColor: "#000000",
    borderColor: "#000000",
    borderWidth: 2,
  });

  return (
    <main className="mx-auto flex max-w-[1200px] gap-4">
      <Preview className="grow" />
      <Settings className="grow" />
    </main>
  );
}
