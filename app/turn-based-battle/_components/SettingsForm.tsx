import { useBattleStore } from "../_store/useBattleStore";
import StepCharacter from "./StepCharacter";
import StepDifficulty from "./StepDifficulty";
import StepIndicator from "./StepIndicator";
import StepSkills from "./StepSkills";

export default function SettingsForm() {
  const step = useBattleStore((s) => s.step);

  return (
    <div className="w-full max-w-lg space-y-8">
      <div className="text-center">
        <h1 className="mb-2 text-2xl font-bold text-white">⚔️ 턴제 배틀</h1>
        <p className="text-sm text-slate-400">캐릭터를 만들고 전투에 도전하세요</p>
      </div>

      <StepIndicator current={step} />

      <div className="flex justify-center">
        {step === 1 && <StepCharacter />}
        {step === 2 && <StepSkills />}
        {step === 3 && <StepDifficulty />}
      </div>
    </div>
  );
}
