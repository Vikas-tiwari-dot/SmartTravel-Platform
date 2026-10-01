import { useState } from "react";
import { MapPin, Flag, Clock, Plus, X, Search, Milestone as MilestoneIcon, TrendingDown } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import StatusPill from "../components/ui/StatusPill";
import EventAlertCard from "../components/app/EventAlertCard";
import { Spinner } from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import { planTrip } from "../services/routeService";
import { useToast } from "../context/ToastContext";
import { cn } from "../utils/cn";

const CROWD_TONE = { light: "green", moderate: "amber", heavy: "red" };

export default function PlanTrip() {
  const [from, setFrom] = useState("Lajpat Nagar");
  const [to, setTo] = useState("Akshardham Metro");
  const [arrivalTime, setArrivalTime] = useState("");
  const [halts, setHalts] = useState([]);
  const [haltInput, setHaltInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const { notify } = useToast();

  function addHalt() {
    if (!haltInput.trim()) return;
    setHalts((h) => [...h, haltInput.trim()]);
    setHaltInput("");
  }
  function removeHalt(i) {
    setHalts((h) => h.filter((_, idx) => idx !== i));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const res = await planTrip({ from, to, arrivalTime, halts });
      setResult(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="From" icon={MapPin} value={from} onChange={(e) => setFrom(e.target.value)} placeholder="Starting point" required />
            <Input label="To" icon={Flag} value={to} onChange={(e) => setTo(e.target.value)} placeholder="Destination" required />
          </div>
          <Input
            label="Arrival time (optional)"
            icon={Clock}
            type="time"
            value={arrivalTime}
            onChange={(e) => setArrivalTime(e.target.value)}
            hint="VASUNDHARA works backward from this to suggest a departure window."
          />

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink">Halts (optional)</label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g. Tea stall near Faridabad toll"
                value={haltInput}
                onChange={(e) => setHaltInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addHalt())}
                className="flex-1"
              />
              <Button type="button" variant="outline" icon={Plus} onClick={addHalt} aria-label="Add halt">
                Add
              </Button>
            </div>
            {halts.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-2">
                {halts.map((h, i) => (
                  <li key={i}>
                    <StatusPill tone="mist" className="pr-1.5">
                      {h}
                      <button
                        type="button"
                        onClick={() => removeHalt(i)}
                        aria-label={`Remove halt ${h}`}
                        className="ml-1 rounded-full p-0.5 hover:bg-ink/10"
                      >
                        <X size={12} />
                      </button>
                    </StatusPill>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {error && <p className="text-sm font-medium text-red">{error}</p>}

          <Button type="submit" variant="amber" size="md" icon={Search} disabled={loading} className="w-full sm:w-auto">
            {loading ? "Checking live conditions…" : "Find my route"}
          </Button>
        </form>
      </Card>

      {loading && (
        <div className="flex flex-col items-center gap-3 py-10 text-ink/40">
          <Spinner size={26} />
          <p className="text-sm font-medium">Cross-checking traffic, events, and your halts…</p>
        </div>
      )}

      {!loading && !result && (
        <EmptyState
          icon={MilestoneIcon}
          title="Your route options will show up here"
          body="Enter a start and destination above — VASUNDHARA checks for disruptions before it recommends anything."
        />
      )}

      {result && !loading && (
        <div className="space-y-8">
          {result.events.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-semibold text-ink/60">Detected on this route</h3>
              <div className="space-y-3">
                {result.events.map((e) => (
                  <EventAlertCard key={e.id} event={e} />
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="mb-3 text-sm font-semibold text-ink/60">Route options</h3>
            <div className="space-y-3">
              {result.routes.map((r) => (
                <Card
                  key={r.id}
                  className={cn("relative", r.recommended && "border-teal ring-1 ring-teal/30")}
                >
                  {r.recommended && (
                    <span className="absolute -top-3 left-5 rounded-full bg-teal px-2.5 py-0.5 text-[11px] font-bold text-paper">
                      Recommended
                    </span>
                  )}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-display text-base font-semibold text-ink">{r.label}</h4>
                        <StatusPill tone="mist">{r.roadType}</StatusPill>
                        <StatusPill tone={CROWD_TONE[r.crowdLevel]}>{r.crowdLevel} crowd</StatusPill>
                      </div>
                      <p className="mt-1 text-sm text-ink/55">{r.notes}</p>
                      <p className="mt-2 text-xs text-ink/40">{r.waypoints.join(" → ")}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-5 sm:flex-col sm:items-end sm:gap-1">
                      <div className="font-mono-tab text-2xl font-bold text-ink">{r.etaMins}<span className="text-sm font-normal text-ink/40"> min</span></div>
                      <div className="flex items-center gap-3 text-xs text-ink/45">
                        <span>{r.distanceKm} km</span>
                        {r.delayMins > 0 && (
                          <span className="flex items-center gap-1 font-semibold text-red">
                            <TrendingDown size={12} className="rotate-180" /> +{r.delayMins} min
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button
                      variant={r.recommended ? "teal" : "outline"}
                      size="sm"
                      onClick={() => notify(`Starting "${r.label}" — safe travels!`, { tone: "teal" })}
                    >
                      Start this route
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
