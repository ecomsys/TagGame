import { useGamer } from "@/hooks/useGamer";
import { useEffect, useState, useRef } from "react";
import Board from "@/components/Board";
import Timer from "@/components/Timer";
import Modal from "@/components/Modal";
import { Loader } from "@/ui/loader";
import { NavLink } from "react-router-dom";
import { type TileValue } from "@/types/types";
import { useGame } from "@/stores/gameStore";

/* ==== ==== ==== Проверка победы ==== ==== ==== */
const isWin = (tiles: TileValue[]) => {
  for (let i = 0; i < 15; i++) if (tiles[i] !== i + 1) return false;
  return tiles[15] === null;
};

/* ==== ==== ==== Компонент игры ==== ==== ==== */
export default function Game() {
  useGamer();

  /* ==== ==== ==== Zustand: игровые функции и сессия ==== ==== ==== */
  const {
    userSession,
    startNewGame,
    updateCurrentGame,
    finishCurrentGame,
    saveCurrentGameId,
  } = useGame();


  const SIZE = 4; // размер поля 4x4

  /* ==== ==== ==== Локальные состояния ==== ==== ==== */
  const [isShuffling, setIsShuffling] = useState(false); // флаг перемешивания
  const [isGameOver, setIsGameOver] = useState(false); // флаг окончания игры
  const [showModal, setShowModal] = useState(false); // флаг показа модалки
  const [initialized, setInitialized] = useState(false); // флаг загрузки игры
  const [localTime, setLocalTime] = useState(0); // локальный таймер
  const stopTimerRef = useRef<() => void>(() => { }); // для остановки таймера
  const [finalGame, setFinalGame] = useState<{
    // данные финальной игры для модалки
    moves: number;
    time: number;
  } | null>(null);

  /* ==== ==== ==== Текущая игра ==== ==== ==== */
  const currentGame = userSession?.currentGameId
    ? userSession.games.find((g) => g.id === userSession.currentGameId)
    : undefined;


  const tiles = currentGame?.tiles ?? [];
  const moves = currentGame?.movesCount ?? 0;

  /* ==== ==== ==== Таймер с локальным и глобальным обновлением ==== ==== ==== */
  const startTimer = (
    initialTime: number,
    onLocalTick: (time: number) => void,
    onSaveTick: (time: number) => void,
  ) => {
    const start = Date.now() - initialTime * 1000;
    let lastSaved = initialTime;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - start) / 1000);
      onLocalTick(elapsed); // локальное обновление для UI

      // обновляем Zustand каждые 5 секунд
      if (elapsed - lastSaved >= 5) {
        lastSaved = elapsed;
        onSaveTick(elapsed);
      }
    }, 250);

    return () => clearInterval(interval);
  };

  /* ==== ==== ==== Вспомогательные функции ==== ==== ==== */
  const getRandomNeighbor = (neighbors: number[]) =>
    neighbors[Math.floor(Math.random() * neighbors.length)];

  function wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function getNeighbors(index: number) {
    const x = index % SIZE;
    const y = Math.floor(index / SIZE);
    const res = [];
    if (x > 0) res.push(index - 1);
    if (x < SIZE - 1) res.push(index + 1);
    if (y > 0) res.push(index - SIZE);
    if (y < SIZE - 1) res.push(index + SIZE);
    return res;
  }

  /* ==== ==== ==== Перемешивание плиток ==== ==== ==== */
  async function shuffleSmart() {
    if (!currentGame || isShuffling) return;

    setIsShuffling(true);
    const tempTiles = [...currentGame.tiles];
    const moves = 70;
    let prevEmptyIndex: number | null = null;

    for (let i = 0; i < moves; i++) {
      const emptyIndex = tempTiles.indexOf(null);
      let neighbors = getNeighbors(emptyIndex);

      // убираем ход назад
      if (prevEmptyIndex !== null)
        neighbors = neighbors.filter((idx) => idx !== prevEmptyIndex);
      if (neighbors.length === 0) neighbors = getNeighbors(emptyIndex); // если зажали в угол

      const randomIndex = getRandomNeighbor(neighbors);
      prevEmptyIndex = emptyIndex;

      // меняем плитки местами
      [tempTiles[emptyIndex], tempTiles[randomIndex]] = [
        tempTiles[randomIndex],
        tempTiles[emptyIndex],
      ];

      // обновляем Zustand
      updateCurrentGame({
        tiles: tempTiles,
        movesCount: currentGame.movesCount + 1,
      });

      // сброс таймера
      stopTimerRef.current?.();
      stopTimerRef.current = startTimer(
        localTime,
        (t) => setLocalTime(t),
        (t) => updateCurrentGame({ time: t }),
      );

      await wait(100);
    }

    setIsShuffling(false);
  }

  /* ==== ==== ==== Таймер игры ==== ==== ==== */
  useEffect(() => {
    if (!currentGame || currentGame.completed || isGameOver) return;
    if (currentGame.isStarting) return;

    stopTimerRef.current?.();
    stopTimerRef.current = startTimer(
      currentGame.time ?? 0,
      (t) => setLocalTime(t),
      (t) => updateCurrentGame({ time: t }),
    );

    return () => stopTimerRef.current?.();
  }, [
    currentGame?.id,
    currentGame?.completed,
    currentGame?.isStarting,
    updateCurrentGame,
  ]);

  /* ==== ==== ==== Инициализация игры ==== ==== ==== */
  useEffect(() => {
    if (!userSession) return;
    if (!userSession.currentGameId) startNewGame();
    setTimeout(() => setInitialized(true), 0);
  }, [userSession, startNewGame]);

  /* ==== ==== ==== Победа ==== ==== ==== */
  useEffect(() => {
    if (!currentGame || currentGame.completed || !tiles.length) return;
    if (moves === 0) return;

    if (isWin(tiles)) {
      // останавливаем таймер
      stopTimerRef.current?.();

      // фиксируем финальные данные и показываем модалку
      const foo = () => {
        setIsGameOver(true);
        setFinalGame({ moves, time: localTime });
        setShowModal(true);
      };
      foo();
    }
  }, [tiles, currentGame, finishCurrentGame, localTime, moves]);

  /* ==== ==== ==== Рестарт / новая игра ==== ==== ==== */
  const handleRestart = () => {
    finishCurrentGame({ time: localTime }); // фиксируем предыдущую игру
    setShowModal(false); // закрываем модалку
    setLocalTime(0); // сброс таймера
    setIsGameOver(false); // снимаем флаг окончания
    setFinalGame(null); // чистим финальные данные
    startNewGame(); // старт новой игры
  };

  /* ==== ==== ==== Автосохранение currentGameId ==== ==== ==== */
  useEffect(() => {
    if (userSession) saveCurrentGameId();
  }, [userSession, saveCurrentGameId]);


  /* ==== ==== ==== Loader пока игра инициализируется ==== ==== ==== */
  if (!initialized || !currentGame) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-5">
        <Loader />
      </div>
    );
  }


  return (
    <div className="my-container py-2.5">
      {/* Header */}
      <nav
        className="relative flex items-center flex-wrap justify-center bg-gradient-to-r from-teal-500 via-teal-600 to-teal-700 border border-teal-600/40 shadow-[0_0.625rem_1.25rem_rgba(0,0,0,0.25),0_0.25rem_0.375rem_rgba(0,0,0,0.15)]
    px-3 lg:px-6 py-4 mb-5 rounded-[2.5rem] gap-3 max-w-3xl mx-auto w-full
    md:justify-evenly lg:gap-6">

       {/* на главную */}
        <NavLink to="/home" title="На главную">
          <svg className="w-[3.25rem] h-[3.25rem] text-white transition-all duration-200 hover:scale-110 hover:text-yellow-400">
            <use xlinkHref={`${import.meta.env.BASE_URL}sprite/sprite.svg#home`} />
          </svg>
        </NavLink>

        {/* новая игра */}
        <button
          title="Заново"
          className="
      group cursor-pointer
      disabled:opacity-40
      transition-all duration-200
      hover:scale-110 active:scale-95
    "
          disabled={(currentGame?.isStarting ?? isGameOver) || isShuffling}
          onClick={startNewGame}
        >
          <svg className="w-[3.25rem] h-[3.25rem] text-white group-hover:text-yellow-400 transition-colors">
            <use xlinkHref={`${import.meta.env.BASE_URL}sprite/sprite.svg#refresh`} />
          </svg>
        </button>

        {/* перемешать */}
        <button
          title="Перемешать еще"
          className="
      group cursor-pointer
      disabled:opacity-40
      transition-all duration-200
      hover:scale-110 active:scale-95
    "
          disabled={(currentGame?.isStarting ?? isGameOver) || isShuffling}
          onClick={shuffleSmart}
        >
          <svg className="w-[3.25rem] h-[3.25rem] text-white group-hover:text-yellow-400 transition-colors">
            <use xlinkHref={`${import.meta.env.BASE_URL}sprite/sprite.svg#shuffle`} />
          </svg>
        </button>

        {/* ходы */}
        <div className="flex items-center gap-[0.625rem] lg:gap-5 px-4 py-2 rounded-3xl bg-blue-800/40 shadow-inner border border-blue-600/30">
          <svg className="w-[2.5rem] h-[2.5rem] lg:w-[3rem] lg:h-[3rem] text-white">
            <use xlinkHref={`${import.meta.env.BASE_URL}sprite/sprite.svg#footprints`} />
          </svg>
          <span className="font-extrabold text-[1.875rem] lg:text-[2.225rem] leading-[1] text-white min-w-[1.875rem]">
            {moves}
          </span>
        </div>

        {/* таймер */}
        <div className="px-4 py-2 rounded-3xl bg-blue-800/40 shadow-inner border border-blue-600/30">
          <Timer time={localTime} />
        </div>       

        {/* инфо */}
        <NavLink to="/rules" title="Правила игры">
          <svg className="w-[3.25rem] h-[3.25rem] text-white transition-all duration-200 hover:scale-110 hover:text-yellow-400">
            <use xlinkHref={`${import.meta.env.BASE_URL}sprite/sprite.svg#info`} />
          </svg>
        </NavLink>
      </nav>

      <Board tiles={tiles} isGameOver={isGameOver} />

      {/* ==== Модалка финальной игры ==== */}
      {showModal && finalGame && (
        <Modal
          moves={finalGame.moves}
          time={finalGame.time}
          onRestart={handleRestart}
        />
      )}

    </div>
  );
}

