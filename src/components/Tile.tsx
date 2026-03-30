// src/components/Tile.tsx
import { type FC } from "react";

interface TileProps {
  value: number | null;
  x: number;
  y: number;
  size: number;
  onClick: () => void;
}

const getTileGradient = (value: number) => {
  if (value <= 4)
    return "from-blue-500 via-blue-600 to-blue-800";

  if (value <= 8)
    return "from-pink-500 via-pink-600 to-pink-800";

  if (value <= 12)
    return "from-orange-400 via-orange-500 to-orange-700";

  return "from-green-500 via-green-600 to-green-800";
};


const isCorrect = (value: number, x: number, y: number, size: number) => {
  const col = Math.round(x / size);
  const row = Math.round(y / size);
  const index = row * 4 + col;

  return value === index + 1;
};


const getGlow = (value: number) => {
  if (value <= 4)
    return "shadow-[0_0_20px_rgba(59,130,246,0.6)]"; // blue

  if (value <= 8)
    return "shadow-[0_0_20px_rgba(236,72,153,0.6)]"; // pink

  if (value <= 12)
    return "shadow-[0_0_20px_rgba(249,115,22,0.6)]"; // orange

  return "shadow-[0_0_20px_rgba(34,197,94,0.6)]"; // green
};

const Tile: FC<TileProps> = ({ value, x, y, size, onClick }) => {
  if (value === null) return null;

  const correct = isCorrect(value, x, y, size);
  return (
    <div
      onClick={onClick}
      className={`
        absolute flex items-center justify-center
        rounded-2xl
        font-extrabold text-4xl sm:text-5xl md:text-6xl
        text-white
        cursor-pointer select-none

        transition-all duration-200 ease-out
        active:scale-90

        bg-gradient-to-br ${getTileGradient(value)}
        
        shadow-[0_0.375rem_0_rgba(0,0,0,0.25),0_0.875rem_1.5625rem_rgba(0,0,0,0.35)]
        hover:shadow-[0_0.25rem_0_rgba(0,0,0,0.3),0_0.625rem_1.25rem_rgba(0,0,0,0.4)]

        border border-white/10
         ${correct ? `${getGlow(value)} ring-3 ring-white/50` : ""}
      `}
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