import { useEffect, useState } from "react";
import { Megaphone, MessageSquare, Coffee, Users, Info, CheckCheck } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { Skeleton } from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import { getNotifications, markAsRead, markAllAsRead } from "../services/notificationService";
import { cn } from "../utils/cn";

const TYPE_ICON = { event: Megaphone, message: MessageSquare, halt: Coffee, ride: Users, system: Info };
const TYPE_TONE = {
  event: "bg-red/10 text-red",
  message: "bg-teal/10 text-teal-dark",
  halt: "bg-amber/15 text-amber-dark",
  ride: "bg-green/10 text-green-dark",
  system: "bg-mist text-ink/50",
};

export default function Notifications() {
  const [items, setItems] = useState(null);

  function load() {
    getNotifications().then(setItems);
  }
  useEffect(load, []);

  async function handleRead(id) {
    await markAsRead(id);
    load();
  }
  async function handleReadAll() {
    await markAllAsRead();
    load();
  }

  const unreadCount = items?.filter((n) => n.unread).length ?? 0;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink/50">{unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up"}</p>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" icon={CheckCheck} onClick={handleReadAll}>
            Mark all read
          </Button>
        )}
      </div>

      {!items ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState icon={Info} title="No notifications" body="VASUNDHARA will let you know when something on your route changes." />
      ) : (
        <div className="space-y-2.5">
          {items.map((n) => {
            const Icon = TYPE_ICON[n.type] || Info;
            return (
              <Card
                key={n.id}
                as="button"
                onClick={() => n.unread && handleRead(n.id)}
                className={cn(
                  "flex w-full items-start gap-3.5 text-left transition-colors",
                  n.unread ? "border-teal/30 bg-teal/[0.03]" : ""
                )}
              >
                <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", TYPE_TONE[n.type])}>
                  <Icon size={17} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-ink">{n.title}</p>
                    {n.unread && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-teal" aria-label="Unread" />}
                  </div>
                  <p className="mt-1 text-sm text-ink/55">{n.body}</p>
                  <p className="mt-1.5 text-xs text-ink/35">{n.time}</p>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
