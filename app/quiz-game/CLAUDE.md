# Quiz Game - CLAUDE.md

## Testing
```bash
npx vitest run app/quiz-game
```
- `useQuizStore.test.ts` - 21 cases: startGame, selectAnswer (정답/오답/더블클릭/힌트 감점), useHint (제거/중복/답변 후), nextQuestion, tick/timeout, handleTimeout, resetToSettings, restartWithSameSettings

## Architecture Decisions

### Timer Management
타이머는 `GameView.tsx`의 `useEffect` + `useRef`로 관리하며, `setInterval` 내부에서
`useQuizStore.getState().tick()`을 호출한다. 스토어에 타이머를 두지 않는 이유는
React StrictMode에서 mount→unmount→remount 시 중복 interval이 생기는 것을 방지하기 위함.
`currentIndex`가 변경될 때마다 interval을 재생성하여 문제 전환 시 타이머를 리셋한다.

### Stale Closure Prevention
모든 이벤트 핸들러와 콜백에서 `useQuizStore.getState()`를 사용하여 최신 상태를 참조한다.
- 키보드 핸들러: `useEffect([], [])`에서 등록하되, 내부에서 `getState()` 호출
- 버튼 onClick: `useQuizStore.getState().selectAnswer(idx)` 직접 호출
- `handleExit`: `useCallback([], [])` + `getState().resetToSettings()`

### Double-Click Race Condition Prevention
`selectAnswer`에서 `answered: true`를 점수 계산보다 먼저 `set()`으로 설정한다.
이렇게 하면 빠른 더블클릭 시 두 번째 호출이 `if (answered) return` 가드에 걸린다.
```typescript
// 1단계: 즉시 잠금
set({ answered: true, selectedAnswer: index });
// 2단계: 점수 계산 후 결과 반영
set((s) => ({ score: s.score + questionScore, results: [...s.results, result] }));
```

### Question Building
`buildQuestions()`은 선택된 카테고리의 문제들을 합친 후 Fisher-Yates 셔플로 섞고,
`Math.min(count, pool.length)`로 요청 수와 풀 크기 중 작은 값으로 잘라낸다.
이는 카테고리 1개 선택 시 풀(5문제)보다 많은 수를 요청해도 안전하게 처리하기 위함.

### Hint System
`useHint()`는 정답 인덱스를 제외한 오답 인덱스 3개를 셔플한 후 `HINT_HIDE_COUNT`(2)개를
숨긴다. 문제당 1회만 사용 가능하며, `hintUsed` 플래그로 제어한다.
힌트 사용 시 점수는 `Math.round(questionScore * 0.5)`로 50% 감점.

### Grade Calculation
등급 산정 시 `maxPossible = totalQuestions * baseScore`로 기본 점수만 기준으로 삼는다.
시간 보너스는 추가 보상이므로 100%를 초과할 수 있어 S등급 달성이 가능해진다.

### Form State Management
`SettingsForm`은 Zustand가 아닌 로컬 `useState`로 폼 상태를 관리한다.
카테고리 토글 시 `setQuestionCount`를 자동 클램핑하고, `clampedCount` 파생값으로
표시/전달하여 선택된 카테고리 수 변경 시 문제 수가 유효 범위를 벗어나지 않도록 한다.

## Key Patterns
- `OptionIndex = 0 | 1 | 2 | 3` 타입으로 답안 인덱스를 좁혀 타입 안전성 확보
- `useShallow`로 GameView의 9개 상태 속성을 단일 셀렉터로 구독하여 리렌더링 최소화
- 액션은 `getState().action()` 패턴으로 호출하여 클로저 의존성 제거
- `HINT_HIDE_COUNT`, `MAX_QUESTIONS_PER_POOL` 등 매직넘버를 상수로 추출
- 타이머 바에 `role="progressbar"` + `aria-valuenow`/`aria-valuemax`로 접근성 확보
- `if (!question) return null` 방어 코드로 빈 questions 배열 대응

## Linting & Formatting
- `import type`은 패키지 import 앞에 배치 (ESLint `import/order`)
- `for`, `if`, `return` 앞에 빈 줄 필수 (ESLint `padding-line-between-statements`)
- Tailwind 클래스 순서는 prettier-plugin-tailwindcss가 자동 정렬
- `cursor-pointer`는 레이아웃/스페이싱 클래스 앞에 위치
