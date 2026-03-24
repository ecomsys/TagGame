// src/components/Timer.tsx
import { type FC } from "react";

interface TimerProps {
  /** Время в секундах */
  time: number;
}

const Timer: FC<TimerProps> = ({ time }) => {
  const minutes = Math.floor(time / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (time % 60).toString().padStart(2, "0");

  return (
    <div className="flex items-center gap-[0.625rem] lg:gap-10 text-white" title="Время игры" >
      <svg className="w-[2.5rem] h-[2.5rem] lg:w-[3.75rem] lg:h-[3.75rem]">
        <use xlinkHref={`/sprite/sprite.svg#clock`} />
      </svg>
      <span className="min-w-[5.625rem] font-bold text-[1.875rem] lg:text-[2.625rem]">{minutes}:{seconds}</span>
    </div>
  );
};

export default Timer;
