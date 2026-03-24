import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const baseBtn =
    "font-[Montserrat] font-bold text-[1.25rem] w-[60%] max-w-xs py-4 rounded-2xl transition-all duration-200";

  const tealBtn = `
    bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700
    text-white
    shadow-[inset_0_0.375rem_0.75rem_rgba(255,255,255,0.2),0_0.375rem_0.75rem_rgba(0,0,0,0.25)]
    hover:shadow-[inset_0_0.0625rem_0.125rem_rgba(255,255,255,0.3),0_0.25rem_0.625rem_rgba(0,0,0,0.3)]
    active:translate-y-[0.0625rem]
  `;

  return (
    <div className="h-full flex flex-col items-center justify-start gap-8 pt-20 px-4 ">
      
      {/* Заголовок */}
      <h1 className="text-6xl md:text-7xl font-extrabold text-teal-800 text-center leading-tight">
        Пятнашка
      </h1>

      {/* Подзаголовок / описание */}
      <p className="text-2xl md:text-3xl font-semibold text-teal-900 text-center max-w-3xl">
        Добро пожаловать! Соберите все плитки по порядку, используя логику и стратегию.  
        Попробуйте собрать их за минимальное количество ходов и время!
      </p>

      {/* Кнопка начать игру */}
      <button
        className={`${baseBtn} ${tealBtn} cursor-pointer`}
        onClick={() => navigate("/game")}
      >
        Начать игру
      </button>
    
      {/* Подпись разработчика */}
      <span className="text-[1rem] md:text-[1.125rem] text-teal-900">
        Разработано{" "}
        <Link
          className="text-teal-600 uppercase font-semibold"
          to="https://ecomsys.ru"
        >
          EcomSys.ru
        </Link>
      </span>

    </div>
  );
}