# Turn-Based Battle

3개 클래스, 커스텀 스킬, 난이도별 AI를 갖춘 턴제 RPG 배틀 게임.

## Features
- 3개 클래스 (전사/마법사/궁수) - 클래스별 고유 스탯과 7개 스킬 풀
- 스킬 3개 선택 + 커스텀 스킬 생성 (공격/회복/버프/디버프 4종)
- 3단계 난이도 (쉬움/보통/어려움) - AI 스탯 배율 및 의사결정 차등
- SPD 기반 선공 결정, 동점 시 랜덤
- 버프/디버프 시스템: 동명 효과 갱신(중첩 불가), 턴 경과 시 자동 만료
- 독 상태이상: 매 턴 고정 피해
- 방어: 피해 50% 감소
- 플로팅 데미지/회복 표시
- 전투 로그 (타입별 색상 구분, 자동 스크롤)
- 100턴 제한 (초과 시 남은 HP 비교 승패 결정)

## Tech Stack
- **State Management**: Zustand (store with separated BattleState/BattleActions interfaces)
- **Rendering Optimization**: `useShallow` from `zustand/shallow`, `React.memo`
- **Styling**: Tailwind CSS v4 + daisyUI (range)
- **Utility**: `cn()` (tailwind-merge)

## File Structure
```
app/turn-based-battle/
├── page.tsx                  # 메인 페이지 (settings ↔ battle ↔ result)
├── _types/index.ts           # Skill (discriminated union), Fighter, BattleAction, etc.
├── _constants/index.ts       # 클래스 데이터, 스킬 풀, 난이도 설정, AI 이름
├── _utils/
│   ├── battleUtils.ts        # 데미지 계산, 버프/디버프, 독, AI 생성/의사결정, 턴 순서
│   └── battleUtils.test.ts   # 단위 테스트 (45 cases)
├── _store/
│   ├── useBattleStore.ts     # Zustand 스토어
│   └── useBattleStore.test.ts # 단위 테스트 (23 cases)
└── _components/
    ├── SettingsForm.tsx       # 3단계 설정 폼 래퍼
    ├── StepIndicator.tsx      # 스텝 진행 표시기
    ├── StepCharacter.tsx      # 이름 입력, 클래스 선택
    ├── StepSkills.tsx         # 스킬 선택, 커스텀 스킬 생성 폼
    ├── StepDifficulty.tsx     # 난이도 선택, 최종 확인
    ├── BattleView.tsx         # 전투 UI (파이터 패널, 액션, 로그)
    └── ResultView.tsx         # 승패 결과, 통계
```

## Game Flow
1. `settings` - 3단계 설정 (캐릭터 → 스킬 → 난이도)
2. `battle` - 턴제 전투 (턴 시작: 독/버프 틱 → 행동 → 턴 종료)
3. `result` - 승패 결과, 총 턴 수, 양측 잔여 HP 표시

## Class Stats

| 클래스 | HP | MP | ATK | DEF | SPD |
|---|---|---|---|---|---|
| 전사 | 130 | 50 | 14 | 12 | 8 |
| 마법사 | 80 | 90 | 18 | 6 | 10 |
| 궁수 | 100 | 60 | 16 | 8 | 14 |

## AI Difficulty

| 난이도 | 스탯 배율 | 행동 패턴 |
|---|---|---|
| 쉬움 | 85% | HP 15% 이하 시 회복, 30% 확률 스킬 공격, 나머지 기본 공격 |
| 보통 | 100% | HP 25% 이하 시 회복/방어, 50% 확률 스킬 사용 |
| 어려움 | 120% | HP 30% 이하 시 회복/방어, 적극적 버프/디버프, 80% 스킬 사용 |

## Damage Formula
```
raw = ATK × multiplier - DEF × 0.5
damage = randomVariance(max(1, raw), ±10%)
final = max(1, damage) × (defending ? 0.5 : 1.0)
```
