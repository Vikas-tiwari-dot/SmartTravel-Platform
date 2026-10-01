import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock3, Fuel, MessageSquareWarning, Route as RouteIcon } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import MilestoneStat from "../components/ui/MilestoneStat";
import EventAlertCard from "../components/app/EventAlertCard";
import { Skeleton } from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import { useAuth } from "../context/AuthContext";
import { getRecentTrips, getDetectedEvents } from "../services/routeService";

export default function Dashboard() {
  const [trips, setTrips] = useState(null);
  const [events, setEvents] = useState(null);
  const { user } = useAuth();
  const stats = user?.stats || { hoursSaved: 0, fuelSavedLitres: 0, tripsPlanned: 0, giveWaysSent: 0 };

  useEffect(() => {
    getRecentTrips().then(setTrips);
    getDetectedEvents().then(setEvents);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1 lg:hidden">
        <h1 className="font-display text-2xl font-bold text-ink">Hey, {user?.name?.split(" ")[0] || "there"}</h1>
        <p className="text-sm text-ink/50">Your commute, coordinated.</p>
      </div>

      {/* Quick plan CTA */}
      <Card className="flex flex-col items-start gap-4 bg-ink text-paper sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold">Where are you headed?</h2>
          <p className="mt-1 text-sm text-paper/60">
            VASUNDHARA checks live events and traffic before it plans your route.
          </p>
        </div>
        <Button as={Link} to="/app/plan" variant="amber" icon={ArrowRight} iconPosition="right">
          Plan a trip
        </Button>
      </Card>

      {/* Stats */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-ink/60">This month</h3>
        <div className="flex flex-wrap gap-3.5">
          <MilestoneStat value={stats.hoursSaved} unit="hr" label="Time saved vs standard GPS" band="teal" />
          <MilestoneStat value={stats.fuelSavedLitres} unit="L" label="Fuel saved from fewer idles" band="green" />
          <MilestoneStat value={stats.tripsPlanned} label="Trips planned all-time" band="amber" />
          <MilestoneStat value={stats.giveWaysSent} label="Give Ways sent to fellow commuters" band="ink" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        {/* Recent trips */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ink/60">Recent trips</h3>
            <Link to="/app/plan" className="text-xs font-semibold text-teal hover:text-teal-dark">
              Plan another →
            </Link>
          </div>
          {!trips ? (
            <div className="space-y-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : trips.length === 0 ? (
            <EmptyState
              icon={RouteIcon}
              title="No trips yet"
              body="Plan your first route and VASUNDHARA will remember it here."
              action={
                <Button as={Link} to="/app/plan" variant="outline" size="sm">
                  Plan a trip
                </Button>
              }
            />
          ) : (
            <div className="space-y-3">
              {trips.map((t) => (
                <Card key={t.id} className="flex items-center justify-between gap-4" padded>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-mist text-teal-dark">
                      <RouteIcon size={17} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink">
                        {t.from} → {t.to}
                      </p>
                      <p className="text-xs text-ink/45">{formatTripDate(t.date)}</p>
                    </div>
                  </div>
                  <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-green-dark">
                    <Clock3 size={13} /> -{t.savedMins} min
                  </span>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Detected events */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <MessageSquareWarning size={15} className="text-red" />
            <h3 className="text-sm font-semibold text-ink/60">Detected around you</h3>
          </div>
          {!events ? (
            <div className="space-y-3">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((e) => (
                <EventAlertCard key={e.id} event={e} />
              ))}
            </div>
          )}
        </div>
      </div>

      <Card className="flex items-center gap-4 border-amber/30 bg-amber/5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber/20 text-amber-dark">
          <Fuel size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-ink">Smart Halt due on your usual route</p>
          <p className="text-xs text-ink/50">Sharma Tea Point has a pre-order ready for pickup.</p>
        </div>
        <Button as={Link} to="/app/halts" variant="outline" size="sm">
          View halts
        </Button>
      </Card>
    </div>
  );
}

function formatTripDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
}
