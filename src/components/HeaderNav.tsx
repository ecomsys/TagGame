import { NavLink } from "react-router-dom";

interface NavItem {
  to: string;
  iconId: string;
  label: string;
  iconWidth?: string;
  iconHeight?: string;
}

const navItems: NavItem[] = [
  {
    to: "/home",
    iconId: "home",
    label: "Главная",
    iconWidth: "w-8",
    iconHeight: "h-8",
  },
  {
    to: "/game",
    iconId: "play",
    label: "Играть",
    iconWidth: "w-8",
    iconHeight: "h-8",
  },
  {
    to: "/leaderboard",
    iconId: "trophy",
    label: "Рекорды",
    iconWidth: "w-8",
    iconHeight: "h-8",
  },
  {
    to: "/rules",
    iconId: "info",
    label: "Правила",
    iconWidth: "w-8",
    iconHeight: "h-8",
  },
];

export function HeaderNav() {
  return (


    <nav className="relative rounded-[25px] flex items-center overflow-hidden w-full bg-red-100">   

      <div className="relative rounded-[25px] flex w-full items-center h-[80px] justify-around px-2">
        {navItems.map(({ to, iconId, label, iconWidth, iconHeight }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col justify-center items-center gap-1.5 transition-transform duration-200 ${isActive ? "scale-110" : "scale-100"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <svg
                  className={`${iconWidth} ${iconHeight} flex-shrink-0 transition-transform duration-200 ${isActive
                      ? "text-grayscale-500 scale-110"
                      : "text-white scale-100"
                    }`}
                >
                  <use xlinkHref={`/sprite/sprite.svg#${iconId}`} />
                </svg>
                <span
                  className={`text-[12px] leading-none font-semibold transition-all duration-200 ${isActive ? "text-grayscale-500" : "text-white"
                    }`}
                >
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ),
        )}
      </div>
    </nav>

  );
}
