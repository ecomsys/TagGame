// src/components/Tile.tsx
import { type FC } from "react";

interface TileProps {
  value: number | null;
  x: number;
  y: number;
  size: number;
  onClick: () => void;
}

const Tile: FC<TileProps> = ({ value, x, y, size, onClick }) => {
  if (value === null) return null;

  return (
    <div
      onClick={onClick}
      className="
        absolute flex items-center justify-center
        rounded-2xl
        font-extrabold text-4xl sm:text-5xl md:text-6xl
        text-white
        cursor-pointer select-none

        transition-all duration-200 ease-out
        active:scale-90

        bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900
        
        shadow-[0_0.375rem_0_rgba(0,0,0,0.25),0_0.875rem_1.5625rem_rgba(0,0,0,0.35)]
        hover:shadow-[0_0.25rem_0_rgba(0,0,0,0.3),0_0.625rem_1.25rem_rgba(0,0,0,0.4)]

        border border-white/10
      "
      style={{
        width: `${size}%`,
        height: `${size}%`,
        left: `${x}%`,
        top: `${y}%`,
      }}
    >
      {/* глянец сверху */}
      <div className="absolute inset-0 rounded-2xl bg-white/10 blur-[0.125rem]" />

      {/* цифра */}
      <span className="relative z-10 drop-shadow-[0_0.125rem_0.25rem_rgba(0,0,0,0.6)]">
        {value}
      </span>
    </div>
  );
};

export default Tile;