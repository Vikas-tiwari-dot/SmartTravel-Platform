import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Route,
  RadioTower,
  Coffee,
  Users,
  Bell,
  CircleUserRound,
  Milestone,
} from "lucide-react";
import { cn } from "../../utils/cn";

const NAV = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/app/plan", label: "Plan a Trip", icon: Route },
  { to: "/app/map", label: "Live Map", icon: RadioTower },
  { to: "/app/halts", label: "Smart Halts", icon: Coffee },
  { to: "/app/ride-circle", label: "Ride Circle", icon: Users },
  { to: "/app/notifications", label: "Notifications", icon: Bell },
  { to: "/app/profile", label: "Profile", icon: CircleUserRound },
];

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-line bg-paper h-screen sticky top-0">
      <div className="flex items-center gap-2 px-6 py-6">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink text-amber">
          <Milestone size={18} strokeWidth={2.25} />
        </span>
        <span className="font-display text-lg font-bold tracking-tight">TripLink</span>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive ? "bg-ink text-paper" : "text-ink/60 hover:bg-mist hover:text-ink"
              )
            }
          >
            <Icon size={18} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="px-3 pb-6 pt-3">
        <div className="rounded-xl bg-mist px-4 py-3.5">
          <p className="text-xs font-semibold text-ink/70">Built on Indian road conditions</p>
          <p className="mt-1 text-[11px] leading-snug text-ink/45">
            Live event + traffic fusion, not just static routing.
          </p>
        </div>
      </div>
    </aside>
  );
}
