"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { CELL_SIZE } from "../_constants";
import { useGameStore } from "../_store/useGameStore";
import Cell from "./Cell";
import ResultBanner from "./ResultBanner";
import StatusBar from "./StatusBar";

export default function GameBoard() {
  const board = useGameStore((s) => s.board);
  const gameStatus = useGameStore((s) => s.gameStatus);
  const settings = useGameStore((s) => s.settings);
  const hitCell = useGameStore((s) => s.hitCell);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (gameStatus === "playing") {
      timerRef.current = setInterval(() => {
        useGameStore.getState().tick();
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [gameStatus]);

  const handleLeftClick = useCallback((row: number, col: number) => {
    const state = useGameStore.getState();

    if (state.gameStatus === "ready") {
      state.handleFirstClick(row, col);
    } else if (state.gameStatus === "playing") {
      state.openCell(row, col);
    }
  }, []);

  const handleRightClick = useCallback((row: number, col: number) => {
    useGameStore.getState().toggleFlag(row, col);
  }, []);

  const flatBoard = useMemo(() => board.flat(), [board]);
  const gameOver = gameStatus === "won" || gameStatus === "lost";

  return (
    <div className="flex flex-col items-center gap-3">
      <div style={{ width: settings.cols * CELL_SIZE }}>
        <StatusBar />
      </div>

      <div className="max-w-[calc(100vw-2rem)] overflow-auto">
        <div className="relative" onContextMenu={(e) => e.preventDefault()}>
          <div
            className="inline-grid"
            style={{
              gridTemplateColumns: `repeat(${settings.cols}, ${CELL_SIZE}px)`,
              gridTemplateRows: `repeat(${settings.rows}, ${CELL_SIZE}px)`,
            }}
          >
            {flatBoard.map((cell) => (
              <Cell
                key={`${cell.row}-${cell.col}`}
                cell={cell}
                isHit={hitCell?.row === cell.row && hitCell?.col === cell.col}
                gameOver={gameOver}
                onLeftClick={handleLeftClick}
                onRightClick={handleRightClick}
              />
            ))}
          </div>

          <ResultBanner />
        </div>
      </div>
    </div>
  );
}
