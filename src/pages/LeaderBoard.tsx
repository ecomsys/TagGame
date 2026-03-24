import { useGame } from "@/stores/gameStore";
import { formatTime } from "@/utils/format";
import { useNavigate } from "react-router-dom";

export default function Leaderboard() {
  const { userSession, clearGames } = useGame();
    const navigate = useNavigate();

  const games = userSession?.games
    .filter((g) => g.completed)
    .slice(-10)
    .reverse();

  const buttonBase = "font-[Montserrat] font-bold text-xl md:text-2xl px-6 py-3 rounded-2xl transition-all duration-200 shadow-md w-full max-w-xs";

  const buttonTeal = "bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700 text-white hover:scale-105 active:translate-y-[0.0625rem]";

  return (

    <div className="h-full flex flex-col items-center gap-5 pt-[2.5rem] px-4 pb-[1.875rem] bg-teal-50/20 min-h-screen">

      {/* Кнопка "Вернуться в игру" */}
      <button
        className={`${buttonBase} ${buttonTeal}`}
        onClick={() => navigate("/game")}
      >
        Вернуться в игру
      </button>
      {/* ==========================================================
          Заголовок таблицы
        ========================================================== */}
      <div className="flex flex-col items-center justify-center gap-3 pt-[0.625rem]">
        <h1 className="text-4xl font-extrabold bg-clip-text text-transparent 
                       bg-gradient-to-r from-teal-500 via-teal-600 to-teal-700">
          Таблица рекордов
        </h1>
        <p className="text-xl max-w-2xl text-teal-900 text-center ">Твои последние игры</p>
      </div>

      {/* ==========================================================
          Таблица рекордов
        ========================================================== */}
      <div className="w-full max-w-3xl mx-auto rounded-[2rem] 
                        bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700
                        border border-teal-600/30
                        shadow-[0_0.625rem_1.875rem_rgba(0,0,0,0.25),0_0.25rem_0.375rem_rgba(0,0,0,0.15)]
                        overflow-hidden">
        {/* Заголовок таблицы */}
        <div className="grid grid-cols-4 gap-4 px-6 py-4 bg-teal-700 text-white font-semibold text-left">
          <div>Аватар</div>
          <div>Имя</div>
          <div>Ходы</div>
          <div>Время</div>
        </div>

        {/* Игры */}
        <div className="flex flex-col divide-y divide-teal-600/50">
          {games?.map((game) => {
            const user = userSession?.gamer;
            return (
              <div
                key={game.id}
                className="grid grid-cols-4 gap-4 px-6 py-4 items-center text-white 
                             hover:bg-teal-800/40 transition-colors rounded-xl"
              >
                {/* Аватар */}
                <div>
                  <img
                    src={user?.photo_url || "/avatar-placeholder.png"}
                    alt={user?.username || "User"}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </div>

                {/* Имя */}
                <div>{user?.username || "Игрок"}</div>

                {/* Ходы */}
                <div>{game.movesCount ?? 0}</div>

                {/* Время */}
                <div>{formatTime(game.time ?? 0)}</div>
              </div>
            );
          })}

          {/* Если нет игр */}
          {!games || games.length === 0 ? (
            <div className="px-6 py-4 text-white/70 text-center">
              Еще нет сыгранных игр
            </div>
          ) : null}
        </div>
      </div>

      {/* ==========================================================
          Кнопка очистки всех игр
        ========================================================== */}
      {games && games.length > 0 && (
        <div className="flex justify-center mt-6">
          <button
            className="bg-teal-600 text-white font-semibold px-6 py-3 
                         rounded-2xl hover:bg-teal-500 transition-colors shadow-md"
            onClick={() => clearGames()}
          >
            Очистить рекорды
          </button>
        </div>
      )}
    </div>

  );
}