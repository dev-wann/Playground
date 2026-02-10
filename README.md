# About
Personal web UI archiving project.  
Collection of the web UIs that I have developed or seen somewhere before.  
Most of the items are built with React and TypeScript.  
  
Link: https://playground-dev-wann.vercel.app/  
&nbsp;

# Items (from new to old)

## Turn-Based Battle
<img src="https://github.com/user-attachments/assets/a0309dcf-fe91-4dc8-8c54-9e943f03e373" alt="turn-based-battle" width="50%" height="50%" />

- An RPG-style turn-based battle system with character customization and AI opponents.
- Choose from 3 character classes (Warrior, Mage, Archer), each with unique stats and skill pools.
- Select 3 skills from the class pool or create custom skills with 4 types: Attack, Heal, Buff, and Debuff.
- Battle against AI with 3 difficulty levels (Easy, Normal, Hard) that differ in stat scaling and strategy.
- SPD-based turn order, status effect system (buff/debuff/poison/defense), and floating damage display.
- 100-turn cap with HP-based tiebreaker and detailed result stats.

## Quiz Game
<img width="522" height="501" alt="quiz-game" src="https://github.com/user-attachments/assets/8d33b840-7b44-44a0-9451-f589ac350d0d" />

- A multi-category quiz game with scoring, hints, and detailed results.
- 6 categories (General Knowledge, Science, History, Geography, Culture/Art, IT/Technology) and 3 difficulty levels.
- Configurable question count (1-20), time limit (5-120s), and optional hint system that removes 2 wrong answers.
- Time bonus rewards fast answers; grade system (S/A/B/C/D/F) based on achievement rate.
- Keyboard support (1/2/3/4 to select, Enter/Space for next) and per-question review in the result screen.

## Minesweeper
![minesweeper](https://github.com/user-attachments/assets/9820bba1-4689-4875-b2bf-0f22c3c93285)

- A classic Minesweeper game with customizable settings.
- 3 difficulty presets (Beginner, Intermediate, Expert) and a custom mode for board size and mine count.
- First-click safety guarantees the first click and its neighbors are always mine-free.
- Left-click to reveal cells, right-click to toggle flags. Empty cells auto-reveal via flood fill.
- Optional timer with automatic game over on timeout.

## Scratch Card
![thumbnail](https://github.com/user-attachments/assets/8b4d6b8e-5e4a-40eb-bfc5-5a60f32952b3)

- A scratch card (or scratch lottery) for e-commerce events.
- Scratch the card by hold and drag your mouse on it.
- You can set the threshold to reveal the result and probability to win.

## Interactive Log In  
![thumbnail](https://github.com/dev-wann/Playground/assets/89072661/4cefad11-a91d-441c-8215-5853c12d6ccb)

- An interactive login form with an emoji and a message.
- The facial expression of emoji and the message changes according to the login status.
  1. IDLE state: The initial state. Shows a smiling face with a message 'Hello there!'.
  2. EDIT_ID state: Editing ID input. Emoji follows your text cursor.
  3. EDIT_PW_HIDE state: Editing PW input with password hidden. Emoji closes its eyes and does not follow your text cursor.
  4. EDIT_PW_SHOW state state: Editing PW input with password shown. Emoji opens only one eye and follows your text cursor.
  5. SUCCESS state: Login success. Shows a smiling face with a message `Welcome ${user_name}`.
  6. FAIL state: Login fail. Shows a 'x_x' face with an error message.
  
## Glowing Bento Box  
![thumbnail](https://github.com/dev-wann/Playground/assets/89072661/e5557d86-7588-48e7-8b85-37c6a5b61c36)

- A Bento box design with hovering effect.
- Hovered item is highlighted with a glow effect that follows the mouse pointer.
- If one of the items is highlighted, the others are dehilighted.
  
## Folder flip  
![thumbnail](https://github.com/dev-wann/Playground/assets/89072661/6de34fa8-487f-41d7-9718-c1a490f272d8)

- A folder UI that interacts with mouse click.
- When left clicked, flip the folder page forward. (shows the next page)
- When right clicked, flip the folder page backward. (shows the previous page)
- When doubled clicked at the last page, close the folder.
- Automatically closed when it goes out of the viewport.
  
# Comet  
![thumbnail](https://github.com/dev-wann/Playground/assets/89072661/c3ed7b63-1c0e-401e-b3f1-32f92bf8940d)

- A comet UI that interacts with mouse move and click.
- The comet tail follows the mouse pointer.
- Accelerate when left mouse button pressed.
- Black out when mouse button is pressed more than 3 seconds.
  
&nbsp;  
Seungwan Cho  
2024.02.16  
