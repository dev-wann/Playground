# Minesweeper

A classic Minesweeper game with customizable settings.

## Features
- 3 difficulty presets (Beginner, Intermediate, Expert) + custom mode
- First click is always safe (clicked cell and its neighbors are guaranteed mine-free)
- Left click to reveal cells, right click to toggle flags
- BFS flood fill for connected empty cells
- Optional time limit with automatic game over on timeout
- Light/dark mode support

## Tech Stack
- **State Management**: Zustand (store with separated GameState/GameActions interfaces)
- **Form**: react-hook-form (settings form with dynamic validation)
- **Icons**: @phosphor-icons/react

## File Structure
```
app/minesweeper/
├── page.tsx                  # Main page (settings <-> game view)
├── _types/index.ts           # Cell, GameSettings, GameStatus, LoseReason, etc.
├── _constants/index.ts       # Difficulty presets, cell size, number colors
├── _utils/
│   ├── boardUtils.ts         # Board creation, mine placement, BFS reveal, win check
│   └── boardUtils.test.ts    # Unit tests (21 cases)
├── _store/
│   ├── useGameStore.ts       # Zustand store
│   └── useGameStore.test.ts  # Unit tests (16 cases)
└── _components/
    ├── SettingsForm.tsx       # Difficulty selection, custom settings, time limit toggle
    ├── GameBoard.tsx          # CSS Grid board, timer lifecycle, click handlers
    ├── Cell.tsx               # Individual cell (React.memo with custom comparator)
    ├── StatusBar.tsx          # Remaining mines, reset button, elapsed time
    └── ResultBanner.tsx       # Win/loss overlay with reason (mine/timeout)
```

## Game Flow
1. `idle` - Settings form displayed
2. `ready` - Empty board created, waiting for first click
3. `playing` - Mines placed (avoiding first click zone), timer running
4. `won` / `lost` - Result banner with replay option

## Difficulty Presets

| Difficulty | Grid | Mines |
|---|---|---|
| Beginner | 9x9 | 10 |
| Intermediate | 16x16 | 40 |
| Expert | 16x30 | 99 |
| Custom | 5~40 x 5~40 | User-defined |
