# Minesweeper - CLAUDE.md

## Testing
```bash
npx vitest run app/minesweeper
```
- `boardUtils.test.ts` - 21 cases: board creation, mine placement, BFS reveal, win check, mine reveal, time format
- `useGameStore.test.ts` - 16 cases: init, first click, open cell, flag toggle, tick/timeout, reset

## Architecture Decisions

### Timer Management
Timer is managed via `useEffect` + `useRef` in `GameBoard.tsx`, NOT in the Zustand store.
This avoids React StrictMode issues (mount -> unmount -> remount creating duplicate intervals).

### First Click Safety
`handleFirstClick` in the store guards with `if (gameStatus !== "ready") return` to prevent
duplicate calls from stale closures. Click handlers in `GameBoard.tsx` use `useGameStore.getState()`
inside `useCallback` with empty deps to avoid stale closure issues.

### BFS Optimization
`revealCell` uses an index pointer (`let head = 0; queue[head++]`) instead of `queue.shift()`
for O(1) dequeue performance.

### Cell Rendering
`Cell.tsx` uses `React.memo` with a custom comparator checking `isRevealed`, `isFlagged`,
`isMine`, `adjacentMines`, `isHit`, and `gameOver` to minimize re-renders.

### Form Validation
`SettingsForm.tsx` uses a `maxMinesRef` pattern to avoid stale closure in react-hook-form's
`validate` callback. A `useEffect` calls `trigger("mines")` when `rows`/`cols` change to
re-validate the mines field.

### Loss Reason
`LoseReason` type (`"mine" | "timeout"`) distinguishes between clicking a mine and time
limit expiration, allowing `ResultBanner` to show different messages/emojis.

## Key Patterns
- Immutable board updates: `board.map()` with selective row skipping in `toggleFlag`
- `useShallow` from `zustand/shallow` in `StatusBar` for optimized multi-property selectors
- `useMemo(() => board.flat(), [board])` in `GameBoard` to avoid recomputing flat array
