# Turn-Based Battle - CLAUDE.md

## Testing
```bash
npx vitest run app/turn-based-battle
```
- `battleUtils.test.ts` - 45 cases: getEffectiveStat, 데미지 계산, 방어 감소, 버프/디버프 적용, 독/틱, executeAction (공격/회복/버프/디버프/MP 가드), AI 생성, AI 의사결정, 선공 판정
- `useBattleStore.test.ts` - 23 cases: 설정 (이름/클래스/스킬/난이도/커스텀), 전투 시작 유효성 검증, 턴 처리 (공격/방어/스킬), 게임 종료, 플로팅 데미지, 상태 초기화

## Architecture Decisions

### Discriminated Union for Skill Types
`Skill` 타입은 `AttackSkill | HealSkill | BuffSkill | DebuffSkill`로 분리된다.
이를 통해 `executeAction`의 `switch (skill.type)` 분기에서 TypeScript가 자동으로
각 variant의 필드를 좁혀주므로 `skill.multiplier!` 같은 non-null assertion이 불필요하다.
`BattleAction` 역시 discriminated union으로 `{ type: "skill"; skill: Skill }`일 때만
`skill` 필드가 존재하도록 보장한다.

### Turn Processing Architecture
`playerAction` 호출 시 한 라운드에 양측 모두 행동한다. `processOneFighterTurn` 헬퍼를
추출하여 첫 번째/두 번째 공격자에 동일한 로직을 적용한다.
```
1라운드 = [독/버프 틱 → 행동 → 사망 체크] × 2 (선공 → 후공)
```
이 구조 덕분에 선공이 적을 죽이면 후공 턴은 실행되지 않는다.

### Floating Damage with Auto-Cleanup
`FloatingDamage`는 `id: number`로 식별되며 module-level counter(`floatingIdSeq`)로
생성한다. `FloatingNumber` 컴포넌트가 `useEffect`로 1200ms 후 자동 제거를 호출하여
store에 stale 데이터가 남지 않는다. 한 라운드에 양측 모두 데미지를 줄 수 있으므로
`FloatingDamage[]` 배열로 관리한다.

### Structured ActionResult (No Regex)
`executeAction`은 `ActionResult`를 반환하며, `damageDealt`와 `healedAmount` 필드로
수치 데이터를 구조적으로 전달한다. 이전에는 로그 메시지에서 정규식으로 데미지 값을
파싱했으나, 이 방식은 메시지 포맷 변경에 취약하여 구조적 반환으로 교체했다.

### AI Stat Variance
AI 스탯에 난이도 배율 적용 후 ±3% 범위의 랜덤 변동을 추가한다.
이전 additive 방식(±0~3)은 SPD=8에 37%까지 변동이 생겨 밸런스를 깨뜨렸다.
percentage-based로 변경하여 모든 스탯에 균일한 비율의 변동을 보장한다.

### Fisher-Yates Shuffle
AI 스킬 선택과 배열 셔플에 Fisher-Yates 알고리즘을 사용한다.
`sort(() => Math.random() - 0.5)`는 정렬 알고리즘에 따라 편향이 생길 수 있으므로
O(n) 균등 분포를 보장하는 Fisher-Yates로 대체했다.

### Stale Closure Prevention
`ActionPanel`의 onClick, `FloatingNumber`의 cleanup 등 모든 이벤트 핸들러에서
`useBattleStore.getState().action()`을 직접 호출하여 stale closure를 방지한다.
컴포넌트 props으로 액션을 전달하면 클로저에 잡힌 이전 상태를 참조할 위험이 있다.

### Setup Form State in Zustand
퀴즈 게임과 달리 설정 폼 상태를 Zustand에서 관리한다. 클래스 변경 시 스킬 선택과
커스텀 스킬을 연쇄적으로 초기화해야 하는데, 이 의존 상태 동기화를 store 내부의
`setPlayerClass` 액션에서 원자적으로 처리한다.

## Key Patterns
- `useShallow`로 `BattleView`, `StepCharacter`, `StepDifficulty`, `ResultView`의 다중 상태를 단일 셀렉터로 구독
- `React.memo`로 `FighterPanel`, `BattleLog` 래핑하여 불필요한 리렌더링 방지
- `LOG_COLORS`, `CLASS_COLORS`, `DIFFICULTY_STYLES` 등 정적 매핑을 render 함수 밖으로 호이스팅
- `SetupStep = 1 | 2 | 3` 리터럴 타입으로 스텝 번호 타입 안전성 확보
- `MAX_TURNS`, `MAX_SELECTED_SKILLS` 등 매직넘버를 상수로 추출
- `tickEffects` 순수함수: Fighter를 받아 새 Fighter를 반환 (immutable update)
- `toggleSkill`에서 3개 상한 체크: `selectedSkills.length < 3`일 때만 추가 허용
- `removeCustomSkill`에서 `customSkills`와 `selectedSkills` 동시 필터링으로 정합성 유지
