import { NavLink } from "react-router-dom";
import { LayoutDashboard, Route, RadioTower, Coffee, Users } from "lucide-react";
import { cn } from "../../utils/cn";

const NAV = [
  { to: "/app", label: "Home", icon: LayoutDashboard, end: true },
  { to: "/app/plan", label: "Plan", icon: Route },
  { to: "/app/map", label: "Map", icon: RadioTower },
  { to: "/app/halts", label: "Halts", icon: Coffee },
  { to: "/app/ride-circle", label: "Circle", icon: Users },
];

export default function MobileNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-line bg-paper/95 backdrop-blur px-2 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-stretch justify-between">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
                isActive ? "text-teal" : "text-ink/45"
              )
            }
          >
            <Icon size={19} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
