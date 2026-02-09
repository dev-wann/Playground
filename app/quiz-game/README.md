# Quiz Game

6개 카테고리, 3단계 난이도, 타이머와 힌트 시스템을 갖춘 4지선다 퀴즈 게임.

## Features
- 6개 카테고리 다중 선택 (일반상식, 과학, 역사, 지리, 문화/예술, IT/기술)
- 3단계 난이도 (쉬움/보통/어려움) - 난이도별 차등 점수
- 문제 수(1~20), 제한 시간(5~120초) 슬라이더 조절
- 힌트 시스템: 오답 2개 제거, 점수 50% 감점
- 타이머: 남은 시간에 따라 색상 변화 (초록→노랑→빨강)
- 시간 보너스: 빠른 정답에 추가 점수
- S~F 등급 시스템 및 문항별 상세 리뷰
- 키보드 지원: 1/2/3/4 답안 선택, Enter/Space 다음 문제

## Tech Stack
- **State Management**: Zustand (store with separated QuizState/QuizActions interfaces)
- **Rendering Optimization**: `useShallow` from `zustand/shallow`
- **Styling**: Tailwind CSS v4 + daisyUI (range, toggle)
- **Utility**: `cn()` (tailwind-merge)

## File Structure
```
app/quiz-game/
├── page.tsx                  # 메인 페이지 (settings ↔ game ↔ result)
├── _types/index.ts           # Category, Difficulty, OptionIndex, Question, QuizSettings, etc.
├── _constants/
│   ├── index.ts              # 카테고리, 난이도 설정, 등급 기준, 유틸 함수
│   └── questions.ts          # 90개 문제 풀 (6 카테고리 × 3 난이도 × 5문제)
├── _store/
│   ├── useQuizStore.ts       # Zustand 스토어
│   └── useQuizStore.test.ts  # 단위 테스트 (21 cases)
└── _components/
    ├── SettingsForm.tsx       # 카테고리/난이도/문제 수/시간/힌트 설정
    ├── GameView.tsx           # 문제 출제, 타이머, 선택지, 힌트
    └── ResultView.tsx         # 등급, 점수, 정답률, 문항별 리뷰
```

## Game Flow
1. `settings` - 카테고리, 난이도, 문제 수, 제한 시간, 힌트 설정
2. `game` - 문제 풀이 (답안 선택 또는 시간 초과 → 정답 공개 → 다음 문제)
3. `result` - 등급/점수/정답률 표시, 문항별 리뷰, 재시작/설정으로 돌아가기

## Scoring

| 난이도 | 기본 점수 | 시간 보너스 (최대) | 힌트 사용 시 |
|---|---|---|---|
| 쉬움 | 100 | +50 | 50% 감점 |
| 보통 | 200 | +50 | 50% 감점 |
| 어려움 | 300 | +50 | 50% 감점 |

시간 보너스 = `(남은 시간 / 제한 시간) × 50` (반올림)

## Grade System

| 등급 | 최소 달성률 |
|---|---|
| S | 95% |
| A | 80% |
| B | 65% |
| C | 50% |
| D | 30% |
| F | 0% |

달성률 = `(획득 점수 / 최대 가능 점수) × 100` (시간 보너스 제외 기준)

## Question Pool
- 총 90문제 (한국어)
- 카테고리당 난이도별 5문제씩
- Fisher-Yates 셔플로 무작위 출제
- 선택 카테고리 × 5 = 최대 문제 수 상한
