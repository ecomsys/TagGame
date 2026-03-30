// src/components/Board.tsx
import { type FC } from "react";
import { useRef } from "react";
import Tile from "./Tile";
import { type TileValue } from "@/types/types";
import { useGame } from "@/stores/gameStore";

interface BoardProps {
  tiles: TileValue[];
  isGameOver?: boolean;
  onMove?: (newTiles: TileValue[]) => void; // новый коллбек
}

const SIZE = 4;
const Board: FC<BoardProps> = ({ tiles, onMove, isGameOver }) => {
  const { updateCurrentGame, userSession } = useGame();

  const currentGame = userSession?.games.find(
    (g) => g.id === userSession.currentGameId,
  );

  // --- Ссылка на аудио ---
  const moveSound = useRef<HTMLAudioElement>(
    typeof Audio !== "undefined" ? new Audio("/games/taggame/audio/move.mp3") : null,
  );

  const moves = currentGame?.movesCount ?? 0;

  /* ==========================================================
     Обработка клика по плитке
  ========================================================= */
  const handleClick = (index: number) => {
    const emptyIndex = tiles.indexOf(null);

    const x1 = index % SIZE;
    const y1 = Math.floor(index / SIZE);
    const x2 = emptyIndex % SIZE;
    const y2 = Math.floor(emptyIndex / SIZE);

    // --- проверка на соседство с пустой клеткой ---
    if (Math.abs(x1 - x2) + Math.abs(y1 - y2) !== 1) return;

    // --- создаём новую последовательность плиток ---
    const newTiles = [...tiles];
    [newTiles[index], newTiles[emptyIndex]] = [
      newTiles[emptyIndex],
      newTiles[index],
    ];

    /* ==========================================================
       Сохранение хода: либо через коллбек, либо напрямую
    ========================================================= */
    if (onMove) {
      onMove(newTiles);
    } else {
      // fallback, если коллбек не передан
      updateCurrentGame(
        {
          tiles: newTiles,
          movesCount: moves + 1,
        },
        true,
      );
    }

    // --- Воспроизвести звук ---
    if (moveSound.current) {
      moveSound.current.currentTime = 0;
      moveSound.current.play().catch(() => {});
    }
  };

  return (
    <div
      className="relative rounded-xl p-5 aspect-square max-w-[76vh] mx-auto"
    >
      {[...Array(16)].map((_, i) => {
        const tileValue = i === 15 ? null : i + 1;
        const index = tiles.indexOf(tileValue);

        const cell = 100 / SIZE;
        const x = (index % SIZE) * cell;
        const y = Math.floor(index / SIZE) * cell;

        return (
          <Tile
            key={tileValue ?? "empty"}
            value={tileValue}
            x={x}
            y={y}
            size={cell}
            onClick={() =>
              tileValue !== null && !isGameOver && handleClick(index)
            }
          />
        );
      })}
    </div>
  );
};

export default Board;
