"use client";

import {
  ReactNode,
  useId,
  useRef,
  ElementType,
  useEffect,
  useState,
} from "react";
import { cn } from "@/app/_utils";

interface PixelBoxProps {
  children: ReactNode;
  cornerSteps?: number;
  pixelSize?: number;
  borderWidth?: number;
  borderColor?: string;
  backgroundColor?: string;
  className?: string;
  as?: ElementType;
}

export function PixelBox({
  children,
  cornerSteps = 1,
  pixelSize = 6,
  borderWidth = 6,
  borderColor = "#000",
  backgroundColor = "#bfa53e",
  className = "",
  as: Component = "div",
}: PixelBoxProps) {
  const id = useId().replaceAll(":", "-");
  const [wrapperPath, setWrapperPath] = useState("");
  const [contentPath, setContentPath] = useState("");
  const wrapperRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const updateClipPath = () => {
      if (!wrapperRef.current) return;

      const wrapper = wrapperRef.current;
      const wrapperWidth = wrapper.offsetWidth;
      const wrapperHeight = wrapper.offsetHeight;

      const maxCornerSteps =
        Math.floor(Math.min(wrapperWidth, wrapperHeight) / 2 / pixelSize) - 1;
      const finalCornerSteps = Math.min(cornerSteps, maxCornerSteps);

      const wrapperPath = generatePixelClipPath(
        wrapperWidth,
        wrapperHeight,
        finalCornerSteps,
        pixelSize,
      );

      const contentPath = generatePixelClipPath(
        wrapperWidth - borderWidth * 2,
        wrapperHeight - borderWidth * 2,
        finalCornerSteps,
        pixelSize,
      );

      setWrapperPath(wrapperPath);
      setContentPath(contentPath);
    };

    updateClipPath();

    const resizeObserver = new ResizeObserver(updateClipPath);
    if (wrapperRef.current) resizeObserver.observe(wrapperRef.current);

    return () => resizeObserver.disconnect();
  }, [pixelSize, borderWidth, cornerSteps]);

  const isReady = wrapperPath && contentPath;

  return (
    <>
      <style>{`
        .pixel-box-wrapper-${id} {
          display: inline-block;
          position: relative;
          width: fit-content;
          height: fit-content;
          padding: ${borderWidth}px;
          background: ${borderColor};
          clip-path: ${wrapperPath};
        }

        .pixel-box-content-${id} {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: ${backgroundColor};
          clip-path: ${contentPath};
        }
      `}</style>
      <Component
        ref={wrapperRef}
        className={cn(
          `pixel-box-wrapper-${id}`,
          "transition-all duration-300",
          isReady ? "-translate-y-1 opacity-100" : "translate-y-0 opacity-0",
        )}
      >
        <div
          className={cn(
            `pixel-box-content-${id}`,
            "absolute h-full w-full brightness-75",
            className,
          )}
        />
        <div
          className={cn(
            `pixel-box-content-${id}`,
            "-translate-y-[2px] transition-all hover:-translate-y-[4px] active:-translate-y-[0px] active:brightness-90",
            className,
          )}
        >
          {children}
        </div>
      </Component>
    </>
  );
}

function generatePixelClipPath(
  width: number,
  height: number,
  cornerSteps: number,
  pixelSize: number,
): string {
  const steps = cornerSteps + 1;
  const points: string[] = [];

  // Top-left corner
  points.push(`0 ${pixelSize * (steps + 1)}px`);

  for (let i = 0; i < steps; i++) {
    points.push(`${pixelSize * i}px ${pixelSize * (steps - i - 1)}px`);
    points.push(`${pixelSize * (i + 1)}px ${pixelSize * (steps - i - 1)}px`);
  }

  points.push(`${pixelSize * steps}px 0`);

  // Top-right corner
  for (let i = 0; i < steps; i++) {
    points.push(`${width - pixelSize * (steps - i - 1)}px ${pixelSize * i}px`);
    points.push(
      `${width - pixelSize * (steps - i - 1)}px ${pixelSize * (i + 1)}px`,
    );
  }

  points.push(`${width}px ${pixelSize * steps}px`);

  // Bottom-right corner
  for (let i = 0; i < steps; i++) {
    points.push(
      `${width - pixelSize * i}px ${height - pixelSize * (steps - i - 1)}px`,
    );
    points.push(
      `${width - pixelSize * (i + 1)}px ${height - pixelSize * (steps - i - 1)}px`,
    );
  }

  points.push(`${width - pixelSize * steps}px ${height}px`);

  // Bottom-left corner
  for (let i = 0; i < steps; i++) {
    points.push(`${pixelSize * (steps - i - 1)}px ${height - pixelSize * i}px`);
    points.push(
      `${pixelSize * (steps - i - 1)}px ${height - pixelSize * (i + 1)}px`,
    );
  }

  return `polygon(${points.join(", ")})`;
}
