import { useState, useEffect } from "react";

export function SplashScreen({
  delay = 2000,
  onFinish,
}: {
  delay?: number;
  onFinish?: () => void;
}) {
  const [hidden, setHidden] = useState(true);
  const [removed, setRemoved] = useState(false);

  const startHide = () => {
    if (removed) return;
    setHidden(true);
    setTimeout(() => {
      setRemoved(true);
      onFinish?.();
    }, 500);
  };

  useEffect(() => {
    const appearTimeout = setTimeout(() => setHidden(false), 50);
    const hideTimeout = setTimeout(() => startHide(), delay);

    const skip = () => startHide();
    window.addEventListener("click", skip);
    window.addEventListener("touchstart", skip);

    return () => {
      clearTimeout(appearTimeout);
      clearTimeout(hideTimeout);
      window.removeEventListener("click", skip);
      window.removeEventListener("touchstart", skip);
    };
  }, [delay]);

  if (removed) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center
        bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700
        text-white text-center
        font-sans
        transition-opacity duration-500 ease-in-out
        ${hidden ? "opacity-0" : "opacity-100"}
      `}
    >
      <div className="flex flex-col items-center gap-6 px-4 max-w-[700px]">
        {/* Заголовок */}
        <h1
          className={`font-avantgardectt text-[48px] md:text-[56px] font-extrabold uppercase
            transform transition-all duration-700 ease-out
            ${hidden ? "-translate-y-8 opacity-0" : "translate-y-0 opacity-100"}
          `}
        >
          Пятнашка
        </h1>

        {/* Описание */}
        <p
          className={`text-white text-[18px] md:text-[20px] font-semibold leading-relaxed
            transform transition-all duration-700 ease-out delay-100
            ${hidden ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100"}
          `}
        >
          Погрузись в увлекательную головоломку! 
          Перетасовывай плитки, перемещай их и собирай в правильном порядке — 
          тренируй логику и стремись побить свой лучший результат!
        </p>
      </div>
    </div>
  );
}