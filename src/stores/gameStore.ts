import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  type GameState,
  type UserSession,
  type Gamer,
} from "@/types/types";

interface GameStore {
  userSession: UserSession | null;
  setUserSession: (session: UserSession) => void;
  initUserSession: (user: Gamer) => void;
  startNewGame: () => void;
  updateCurrentGame: (
    data: Partial<GameState>,
    incrementMove?: boolean,
  ) => void;
  finishCurrentGame: (data: Partial<GameState>) => void;
  saveCurrentGameId: () => void;

  clearGames: () => void;
}
const STORAGE_KEY = `tag-game-storage`;

// Время анимации перемешивания
const ANIMATION_TIME = 100; // мс на каждый ход (можно подправить)
const SIZE = 4; // 4x4 пятнашки
const MAX_HISTORY = 10; // <-- для программиста, можно менять

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      userSession: null,

      setUserSession: (session) => set({ userSession: session }),

      initUserSession: (user: Gamer) => {
        const currentSession = get().userSession;
        if (currentSession?.gamer.id === user.id) return;

        const saved = localStorage.getItem(STORAGE_KEY);
        const loadedSession: UserSession = saved
          ? JSON.parse(saved)
          : { telegramUser: user, games: [], currentGameId: undefined };

        set({ userSession: loadedSession });
      },

      startNewGame: () => {
        const session = get().userSession;
        if (!session) return;

        //  Создаем собранную пятнашку
        const tiles: (number | null)[] = [
          ...Array.from({ length: 15 }, (_, i) => i + 1),
          null,
        ];

        const newGame: GameState = {
          id: crypto.randomUUID(),
          tiles,
          movesCount: 0,
          time: 0,
          startedAt: Date.now(),
          completed: false,
          isStarting: true, // флаг, что игра только стартует
        };

        // добавляем новую игру в начало списка
        let updatedGames = [newGame, ...session.games];

        // обрезаем историю до MAX_HISTORY
        if (updatedGames.length > MAX_HISTORY) {
          updatedGames = updatedGames.slice(0, MAX_HISTORY);
        }

        const updatedSession: UserSession = {
          ...session,
          games: updatedGames,
          currentGameId: newGame.id,
        };

        set({ userSession: updatedSession });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSession));

        //  Через полсекунды начинаем умное перемешивание
        setTimeout(async () => {
          const tempTiles = [...tiles];
          let prevEmptyIndex: number | null = null;
          const moves = 70;

          for (let i = 0; i < moves; i++) {
            const emptyIndex = tempTiles.indexOf(null);
            let neighbors = getNeighbors(emptyIndex);

            if (prevEmptyIndex !== null)
              neighbors = neighbors.filter((idx) => idx !== prevEmptyIndex);
            if (neighbors.length === 0) neighbors = getNeighbors(emptyIndex);

            const randomIndex =
              neighbors[Math.floor(Math.random() * neighbors.length)];

            prevEmptyIndex = emptyIndex;

            [tempTiles[emptyIndex], tempTiles[randomIndex]] = [
              tempTiles[randomIndex],
              tempTiles[emptyIndex],
            ];

            // Обновляем плитки и movesCount, но не инкрементируем реальный moves игрока
            get().updateCurrentGame({ tiles: tempTiles, movesCount: i }, false);

            await wait(ANIMATION_TIME);
          }

          // Перемешивание завершено, игрок может начинать
          get().updateCurrentGame({ isStarting: false }, false);
        }, 500);
      },

      updateCurrentGame: (data, incrementMove = false) => {
        const session = get().userSession;
        if (!session || !session.currentGameId) return;

        const updatedGames = session.games.map((g) => {
          if (g.id === session.currentGameId) {
            return {
              ...g,
              ...data,
              movesCount: incrementMove ? g.movesCount + 1 : g.movesCount,
            };
          }
          return g;
        });

        const updatedSession = { ...session, games: updatedGames };
        set({ userSession: updatedSession });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSession));
      },

      finishCurrentGame: (data) => {
        const session = get().userSession;
        if (!session || !session.currentGameId) return;

        const updatedGames = session.games.map((g) =>
          g.id === session.currentGameId
            ? {
                ...g,
                completed: true,
                finishedAt: Date.now(),
                time: data.time !== undefined ? data.time : g.time,
              }
            : g,
        );

        const updatedSession: UserSession = {
          ...session,
          games: updatedGames,
          currentGameId: undefined,
        };

        set({ userSession: updatedSession });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSession));
      },

      saveCurrentGameId: () => {
        const session = get().userSession;
        if (!session) return;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      },

      clearGames: () => {
        const session = get().userSession;
        if (!session) return;

        // оставляем только последнюю игру (если есть)
        const lastGame = session.games[session.games.length - 1];
        const updatedSession: UserSession = {
          ...session,
          games: lastGame ? [lastGame] : [], // если игр нет, оставляем пустой массив
          currentGameId: lastGame?.id, // текущая игра — последняя
        };

        set({ userSession: updatedSession });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSession));
      },
    }),
    { name: STORAGE_KEY },
  ),
);

// --- Вспомогательные функции для перемешивания ---
function getNeighbors(index: number) {
  const x = index % SIZE;
  const y = Math.floor(index / SIZE);
  const res: number[] = [];
  if (x > 0) res.push(index - 1);
  if (x < SIZE - 1) res.push(index + 1);
  if (y > 0) res.push(index - SIZE);
  if (y < SIZE - 1) res.push(index + SIZE);
  return res;
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Хук для удобного использования глобального состояния игры
 */
export const useGame = () => {
  const userSession = useGameStore((s) => s.userSession);
  const startNewGame = useGameStore((s) => s.startNewGame);
  const updateCurrentGame = useGameStore((s) => s.updateCurrentGame);
  const finishCurrentGame = useGameStore((s) => s.finishCurrentGame);
  const saveCurrentGameId = useGameStore((s) => s.saveCurrentGameId);
  const clearGames = useGameStore((s) => s.clearGames); // <--- вот он

  return {
    userSession,
    startNewGame,
    updateCurrentGame,
    finishCurrentGame,
    saveCurrentGameId,
    clearGames,
  };
};
