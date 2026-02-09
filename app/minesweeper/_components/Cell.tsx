"use client";

import type { Cell as CellType } from "../_types";
import { memo } from "react";
import { CELL_SIZE, NUMBER_COLORS } from "../_constants";
import { cn } from "@/app/_utils";

interface Props {
  cell: CellType;
  isHit: boolean;
  gameOver: boolean;
  onLeftClick: (row: number, col: number) => void;
  onRightClick: (row: number, col: number) => void;
}

function CellComponent({ cell, isHit, onLeftClick, onRightClick }: Props) {
  const handleClick = () => {
    onLeftClick(cell.row, cell.col);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onRightClick(cell.row, cell.col);
  };

  const renderContent = () => {
    if (!cell.isRevealed && cell.isFlagged) {
      return <span className="text-sm">🚩</span>;
    }

    if (!cell.isRevealed) return null;

    if (cell.isMine) {
      return <span className="text-sm">💣</span>;
    }

    if (cell.adjacentMines > 0) {
      return (
        <span
          className={cn("text-sm font-bold", NUMBER_COLORS[cell.adjacentMines])}
        >
          {cell.adjacentMines}
        </span>
      );
    }

    return null;
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className={cn(
        "flex items-center justify-center select-none",
        cell.isRevealed
          ? cn(
              "border border-gray-300 bg-gray-200",
              "dark:border-gray-600 dark:bg-gray-700",
              isHit && "!bg-red-500 dark:!bg-red-700",
            )
          : cn(
              "cursor-pointer",
              "border border-gray-400 bg-gray-300",
              "shadow-[inset_2px_2px_0_#fff,inset_-2px_-2px_0_#999]",
              "dark:border-gray-500 dark:bg-gray-600",
              "dark:shadow-[inset_2px_2px_0_#777,inset_-2px_-2px_0_#333]",
              "hover:brightness-110 active:bg-gray-200 active:shadow-none dark:active:bg-gray-700",
            ),
      )}
      style={{ width: CELL_SIZE, height: CELL_SIZE }}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClick();
      }}
    >
      {renderContent()}
    </div>
  );
}

export default memo(CellComponent, (prev, next) => {
  return (
    prev.cell.isRevealed === next.cell.isRevealed &&
    prev.cell.isFlagged === next.cell.isFlagged &&
    prev.cell.isMine === next.cell.isMine &&
    prev.cell.adjacentMines === next.cell.adjacentMines &&
    prev.isHit === next.isHit &&
    prev.gameOver === next.gameOver
  );
});
