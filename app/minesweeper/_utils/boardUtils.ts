import type { Cell } from "../_types";

function getNeighbors(
  row: number,
  col: number,
  rows: number,
  cols: number,
): [number, number][] {
  const neighbors: [number, number][] = [];

  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = row + dr;
      const nc = col + dc;

      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        neighbors.push([nr, nc]);
      }
    }
  }

  return neighbors;
}

export function createEmptyBoard(rows: number, cols: number): Cell[][] {
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => ({
      row: r,
      col: c,
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      adjacentMines: 0,
    })),
  );
}

function calculateAdjacentMines(board: Cell[][]): Cell[][] {
  const rows = board.length;
  const cols = board[0].length;

  return board.map((rowArr, r) =>
    rowArr.map((cell, c) => {
      if (cell.isMine) return cell;
      const count = getNeighbors(r, c, rows, cols).filter(
        ([nr, nc]) => board[nr][nc].isMine,
      ).length;
      return { ...cell, adjacentMines: count };
    }),
  );
}

export function placeMines(
  board: Cell[][],
  mineCount: number,
  safeRow: number,
  safeCol: number,
): Cell[][] {
  const rows = board.length;
  const cols = board[0].length;

  const excluded = new Set<string>();
  excluded.add(`${safeRow},${safeCol}`);

  for (const [nr, nc] of getNeighbors(safeRow, safeCol, rows, cols)) {
    excluded.add(`${nr},${nc}`);
  }

  const candidates: [number, number][] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!excluded.has(`${r},${c}`)) {
        candidates.push([r, c]);
      }
    }
  }

  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }

  const minePositions = new Set(
    candidates.slice(0, mineCount).map(([r, c]) => `${r},${c}`),
  );

  const newBoard = board.map((rowArr, r) =>
    rowArr.map((cell, c) =>
      minePositions.has(`${r},${c}`) ? { ...cell, isMine: true } : cell,
    ),
  );

  return calculateAdjacentMines(newBoard);
}

export function revealCell(
  board: Cell[][],
  row: number,
  col: number,
): Cell[][] {
  const rows = board.length;
  const cols = board[0].length;
  const cell = board[row][col];

  if (cell.isFlagged || cell.isRevealed || cell.isMine) return board;

  const toReveal = new Set<string>();
  toReveal.add(`${row},${col}`);

  if (cell.adjacentMines === 0) {
    const queue: [number, number][] = [[row, col]];
    let head = 0;

    while (head < queue.length) {
      const [r, c] = queue[head++];

      for (const [nr, nc] of getNeighbors(r, c, rows, cols)) {
        const key = `${nr},${nc}`;
        if (toReveal.has(key)) continue;

        const neighbor = board[nr][nc];
        if (neighbor.isFlagged || neighbor.isMine) continue;

        toReveal.add(key);

        if (neighbor.adjacentMines === 0) {
          queue.push([nr, nc]);
        }
      }
    }
  }

  return board.map((rowArr, r) =>
    rowArr.map((c, cIdx) =>
      toReveal.has(`${r},${cIdx}`) ? { ...c, isRevealed: true } : c,
    ),
  );
}

export function checkWin(board: Cell[][]): boolean {
  return board.every((row) =>
    row.every((cell) => cell.isMine || cell.isRevealed),
  );
}

export function revealAllMines(board: Cell[][]): Cell[][] {
  return board.map((row) =>
    row.map((cell) => (cell.isMine ? { ...cell, isRevealed: true } : cell)),
  );
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
