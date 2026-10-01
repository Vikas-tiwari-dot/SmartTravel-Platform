import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/app/Sidebar";
import MobileNav from "../components/app/MobileNav";
import Topbar from "../components/app/Topbar";

const TITLES = {
  "/app": ["Dashboard", "Your commute, coordinated."],
  "/app/plan": ["Plan a Trip", "Route around what's actually happening today."],
  "/app/map": ["Live Map", "Vehicles nearby, one tap away."],
  "/app/halts": ["Smart Halts", "Pre-order ahead, timers handle the rest."],
  "/app/ride-circle": ["Ride Circle", "Commuters on your route, right now."],
  "/app/notifications": ["Notifications", "Everything VASUNDHARA has flagged for you."],
  "/app/profile": ["Profile", "Your account and vehicle details."],
};

export default function AppLayout() {
  const { pathname } = useLocation();
  const [title, subtitle] = TITLES[pathname] || ["VASUNDHARA", ""];

  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar />
      <div className="flex-1 min-w-0 pb-20 lg:pb-0">
        <Topbar title={title} subtitle={subtitle} />
        <main className="px-4 sm:px-8 py-6 sm:py-8 max-w-6xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
