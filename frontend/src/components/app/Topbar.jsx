import { Link } from "react-router-dom";
import { Bell, Milestone } from "lucide-react";
import { useEffect, useState } from "react";
import { getNotifications } from "../../services/notificationService";
import { useAuth } from "../../context/AuthContext";

export default function Topbar({ title, subtitle }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    let mounted = true;
    getNotifications().then((list) => {
      if (mounted) setUnreadCount(list.filter((n) => n.unread).length);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const initials = user?.name?.split(" ").map((n) => n[0]).join("") || "?";

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-line bg-paper/95 backdrop-blur px-4 sm:px-8 py-4">
      <div className="flex items-center gap-2 lg:hidden">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink text-amber">
          <Milestone size={16} strokeWidth={2.25} />
        </span>
      </div>
      <div className="hidden lg:block min-w-0">
        <h1 className="font-display text-xl font-bold text-ink truncate">{title}</h1>
        {subtitle && <p className="text-sm text-ink/50 truncate">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3 ml-auto">
        <Link
          to="/app/notifications"
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink/60 hover:bg-mist hover:text-ink transition-colors"
        >
          <Bell size={17} />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red px-1 text-[10px] font-bold text-paper">
              {unreadCount}
            </span>
          )}
        </Link>
        <Link to="/app/profile" className="flex items-center gap-2">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-paper"
            style={{ backgroundColor: user?.avatarColor || "#0e7c86" }}
          >
            {initials}
          </span>
        </Link>
      </div>
    </header>
  );
}
