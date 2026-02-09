import { describe, expect, it } from "vitest";
import {
  checkWin,
  createEmptyBoard,
  formatTime,
  placeMines,
  revealAllMines,
  revealCell,
} from "./boardUtils";

describe("createEmptyBoard", () => {
  it("creates a board with correct dimensions", () => {
    const board = createEmptyBoard(5, 8);
    expect(board).toHaveLength(5);
    expect(board[0]).toHaveLength(8);
  });

  it("initializes all cells with default values", () => {
    const board = createEmptyBoard(3, 3);
    const cell = board[1][2];
    expect(cell).toEqual({
      row: 1,
      col: 2,
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      adjacentMines: 0,
    });
  });
});

describe("placeMines", () => {
  it("places the correct number of mines", () => {
    const board = createEmptyBoard(9, 9);
    const result = placeMines(board, 10, 4, 4);
    const mineCount = result.flat().filter((c) => c.isMine).length;
    expect(mineCount).toBe(10);
  });

  it("keeps the clicked cell and its neighbors mine-free", () => {
    const board = createEmptyBoard(9, 9);
    const safeRow = 4;
    const safeCol = 4;
    const result = placeMines(board, 70, safeRow, safeCol);

    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const r = safeRow + dr;
        const c = safeCol + dc;
        expect(result[r][c].isMine).toBe(false);
      }
    }
  });

  it("keeps corner safe zone correct", () => {
    const board = createEmptyBoard(9, 9);
    const result = placeMines(board, 68, 0, 0);

    expect(result[0][0].isMine).toBe(false);
    expect(result[0][1].isMine).toBe(false);
    expect(result[1][0].isMine).toBe(false);
    expect(result[1][1].isMine).toBe(false);
  });

  it("calculates adjacentMines correctly", () => {
    const board = createEmptyBoard(3, 3);
    const result = placeMines(board, 1, 0, 0);

    const mineCell = result.flat().find((c) => c.isMine)!;
    const neighbors = result
      .flat()
      .filter(
        (c) =>
          !c.isMine &&
          Math.abs(c.row - mineCell.row) <= 1 &&
          Math.abs(c.col - mineCell.col) <= 1,
      );

    for (const neighbor of neighbors) {
      expect(neighbor.adjacentMines).toBeGreaterThanOrEqual(1);
    }
  });

  it("does not mutate the original board", () => {
    const board = createEmptyBoard(5, 5);
    placeMines(board, 5, 0, 0);
    const allFalse = board.flat().every((c) => !c.isMine);
    expect(allFalse).toBe(true);
  });
});

describe("revealCell", () => {
  it("reveals a single numbered cell", () => {
    const board = createEmptyBoard(3, 3);
    board[1][1] = { ...board[1][1], adjacentMines: 2 };
    const result = revealCell(board, 1, 1);
    expect(result[1][1].isRevealed).toBe(true);
    expect(result[0][0].isRevealed).toBe(false);
  });

  it("performs BFS flood fill on empty cells", () => {
    const board = createEmptyBoard(5, 5);

    board[0][4] = { ...board[0][4], isMine: true };

    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        if (board[r][c].isMine) continue;
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < 5 && nc >= 0 && nc < 5 && board[nr][nc].isMine)
              count++;
          }
        }
        board[r][c] = { ...board[r][c], adjacentMines: count };
      }
    }

    const result = revealCell(board, 4, 0);

    expect(result[4][0].isRevealed).toBe(true);
    expect(result[0][4].isRevealed).toBe(false);

    const revealedCount = result.flat().filter((c) => c.isRevealed).length;
    expect(revealedCount).toBeGreaterThan(1);
  });

  it("does not reveal flagged cells", () => {
    const board = createEmptyBoard(3, 3);
    board[1][1] = { ...board[1][1], isFlagged: true };
    const result = revealCell(board, 1, 1);
    expect(result[1][1].isRevealed).toBe(false);
  });

  it("returns same board reference for already revealed cells", () => {
    const board = createEmptyBoard(3, 3);
    board[1][1] = { ...board[1][1], isRevealed: true };
    const result = revealCell(board, 1, 1);
    expect(result).toBe(board);
  });

  it("returns same board reference for mine cells", () => {
    const board = createEmptyBoard(3, 3);
    board[1][1] = { ...board[1][1], isMine: true };
    const result = revealCell(board, 1, 1);
    expect(result).toBe(board);
  });

  it("does not reveal mine cells during BFS", () => {
    const board = createEmptyBoard(3, 3);
    board[0][2] = { ...board[0][2], isMine: true };
    board[0][1] = { ...board[0][1], adjacentMines: 1 };
    board[1][1] = { ...board[1][1], adjacentMines: 1 };
    board[1][2] = { ...board[1][2], adjacentMines: 1 };

    const result = revealCell(board, 2, 0);
    expect(result[0][2].isRevealed).toBe(false);
  });
});

describe("checkWin", () => {
  it("returns true when all non-mine cells are revealed", () => {
    const board = createEmptyBoard(3, 3);
    board[0][0] = { ...board[0][0], isMine: true };

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (!board[r][c].isMine) {
          board[r][c] = { ...board[r][c], isRevealed: true };
        }
      }
    }

    expect(checkWin(board)).toBe(true);
  });

  it("returns false when some non-mine cells are unrevealed", () => {
    const board = createEmptyBoard(3, 3);
    board[0][0] = { ...board[0][0], isMine: true };
    board[1][1] = { ...board[1][1], isRevealed: true };
    expect(checkWin(board)).toBe(false);
  });
});

describe("revealAllMines", () => {
  it("reveals all mine cells", () => {
    const board = createEmptyBoard(3, 3);
    board[0][0] = { ...board[0][0], isMine: true };
    board[2][2] = { ...board[2][2], isMine: true };

    const result = revealAllMines(board);
    expect(result[0][0].isRevealed).toBe(true);
    expect(result[2][2].isRevealed).toBe(true);
  });

  it("does not reveal non-mine cells", () => {
    const board = createEmptyBoard(3, 3);
    board[0][0] = { ...board[0][0], isMine: true };

    const result = revealAllMines(board);
    expect(result[1][1].isRevealed).toBe(false);
  });
});

describe("formatTime", () => {
  it("formats 0 seconds", () => {
    expect(formatTime(0)).toBe("00:00");
  });

  it("formats seconds only", () => {
    expect(formatTime(45)).toBe("00:45");
  });

  it("formats minutes and seconds", () => {
    expect(formatTime(125)).toBe("02:05");
  });

  it("formats large values", () => {
    expect(formatTime(3599)).toBe("59:59");
  });
});
