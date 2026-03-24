// src/components/Controls.tsx
import { type FC } from "react";
import { useGame } from "@/stores/gameStore";

interface ControlsProps {
  shuffleAction?: () => void;
  disabled?: boolean;
}

const Controls: FC<ControlsProps> = ({ shuffleAction, disabled }) => {
  const { startNewGame } = useGame();

  const baseBtn =
    "font-[Montserrat] font-medium text-[0.9375rem] w-[50%] py-3 rounded-2xl transition-all duration-200";

  const orangeBtn = `
    bg-yellow-500 text-white
    shadow-[inset_0_0.5rem_0.75rem_rgba(255,255,255,0.4),_0_0.375rem_0.75rem_rgba(0,0,0,0.25)]
    hover:shadow-[inset_0_0.0625rem_0.125rem_rgba(255,255,255,0.5),_0_0.25rem_0.625rem_rgba(0,0,0,0.3)]
    active:translate-y-[0.0625rem]
  `;

  const disabledStyle = "opacity-50 cursor-not-allowed";

  return (
    <div className="flex gap-3 mt-3 mb-3 w-full px-4">
      <button
        className={`${baseBtn} ${orangeBtn} ${disabled ? disabledStyle : ""}`}
        disabled={disabled}
        onClick={startNewGame}
      >
        Новая игра
      </button>

      <button
        className={`${baseBtn} ${orangeBtn} ${disabled ? disabledStyle : ""}`}
        disabled={disabled}
        onClick={shuffleAction}
      >
        Перемешать
      </button>
    </div>
  );
};

export default Controls;
