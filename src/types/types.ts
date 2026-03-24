export type TileValue = number | null;

export interface BoardProps {
  tiles: TileValue[];
  setTiles: React.Dispatch<React.SetStateAction<TileValue[]>>;
  movesCount: number;
  setMovesCount: React.Dispatch<React.SetStateAction<number>>;
  isShuffling: boolean;
}

export interface TileProps {
  value: TileValue;
  x: number;
  y: number;
  onClick: () => void;
}

export interface ControlsProps {
  tiles: TileValue[];
  setTiles: React.Dispatch<React.SetStateAction<TileValue[]>>;
  isShuffling: boolean;
  setIsShuffling: React.Dispatch<React.SetStateAction<boolean>>;
  setMovesCount: React.Dispatch<React.SetStateAction<number>>;
}

// Game Store
export interface Gamer {
  id: string;  
  username?: string;
  photo_url?: string;
}

export interface GameState {
  id: string;
  tiles: (number | null)[];
  movesCount: number;
  time: number;
  startedAt: number;
  completed: boolean;
  finishedAt?: number; // timestamp окончания
  isStarting?: boolean; // <-- флаг старта игры
}

export interface UserSession {
  gamer: Gamer;
  games: GameState[]; // все игры текущей сессии
  currentGameId?: string; // id активной игры
}
