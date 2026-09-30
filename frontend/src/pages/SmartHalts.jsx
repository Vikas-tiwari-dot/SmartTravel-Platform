import { useEffect, useState } from "react";
import { Coffee, Utensils, Bed, Fuel, Droplets, Plus, MapPin, PhoneCall, Timer as TimerIcon, Trash2 } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Modal from "../components/ui/Modal";
import StatusPill from "../components/ui/StatusPill";
import EmptyState from "../components/ui/EmptyState";
import { Skeleton } from "../components/ui/Loader";
import { getHalts, getHaltTypes, createHalt, removeHalt } from "../services/haltService";
import { useCountdown } from "../hooks/useCountdown";
import { useToast } from "../context/ToastContext";
import { cn } from "../utils/cn";

const ICONS = { coffee: Coffee, utensils: Utensils, bed: Bed, fuel: Fuel, droplets: Droplets };

function HaltTimer({ minutes }) {
  const { label, running, secondsLeft } = useCountdown(minutes * 60, { autoStart: true });
  const pct = Math.max(0, Math.min(100, (secondsLeft / (minutes * 60)) * 100));
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative h-9 w-9 shrink-0">
        <svg viewBox="0 0 36 36" className="h-9 w-9 -rotate-90">
          <circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--color-mist-dark)" strokeWidth="3" />
          <circle
            cx="18"
            cy="18"
            r="15.5"
            fill="none"
            stroke={secondsLeft < 60 ? "var(--color-red)" : "var(--color-teal)"}
            strokeWidth="3"
            strokeDasharray={2 * Math.PI * 15.5}
            strokeDashoffset={2 * Math.PI * 15.5 * (1 - pct / 100)}
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div>
        <p className={cn("font-mono-tab text-sm font-bold", secondsLeft < 60 ? "text-red" : "text-ink")}>{label}</p>
        <p className="text-[11px] text-ink/40">{running ? "Timer running" : "Halt complete"}</p>
      </div>
    </div>
  );
}

export default function SmartHalts() {
  const [halts, setHalts] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ place: "", type: "tea", location: "", order: "" });
  const [submitting, setSubmitting] = useState(false);
  const { notify } = useToast();
  const haltTypes = getHaltTypes();

  function loadHalts() {
    getHalts().then(setHalts);
  }

  useEffect(loadHalts, []);

  async function handleCreate(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createHalt(form);
      notify("Halt pre-order sent via IVR", { tone: "green" });
      setModalOpen(false);
      setForm({ place: "", type: "tea", location: "", order: "" });
      loadHalts();
    } catch (err) {
      notify(err.message, { tone: "red" });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRemove(id) {
    await removeHalt(id);
    notify("Halt removed", { tone: "ink" });
    loadHalts();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink/50 max-w-md">
          Pre-order ahead by IVR call, then let the timer manage your stop — it reminds you automatically before you're due back on the road.
        </p>
        <Button variant="amber" icon={Plus} onClick={() => setModalOpen(true)} className="shrink-0">
          New halt
        </Button>
      </div>

      {!halts ? (
        <div className="space-y-3">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : halts.length === 0 ? (
        <EmptyState
          icon={Coffee}
          title="No halts planned"
          body="Add a tea stop, meal, or fuel stop and TripLink will pre-order and time it for you."
          action={
            <Button variant="outline" size="sm" icon={Plus} onClick={() => setModalOpen(true)}>
              Add a halt
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {halts.map((h) => {
            const Icon = ICONS[haltTypes.find((t) => t.id === h.type)?.icon] || Coffee;
            return (
              <Card key={h.id}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-mist text-teal-dark">
                      <Icon size={17} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="truncate font-display text-base font-semibold text-ink">{h.place}</h4>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-ink/45">
                        <MapPin size={11} /> {h.location}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(h.id)}
                    aria-label={`Remove ${h.place}`}
                    className="shrink-0 rounded-lg p-1.5 text-ink/30 hover:bg-red/10 hover:text-red"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <p className="mt-3 rounded-lg bg-mist px-3 py-2 text-xs text-ink/60">{h.order}</p>

                <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
                  <StatusPill tone={h.ivrConfirmed ? "green" : "amber"} dot>
                    <PhoneCall size={11} className="mr-0.5" />
                    {h.ivrConfirmed ? "IVR confirmed" : "IVR pending"}
                  </StatusPill>
                  <HaltTimer minutes={h.plannedMins} />
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add a smart halt"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="amber" onClick={handleCreate} disabled={submitting} icon={TimerIcon}>
              {submitting ? "Placing order…" : "Pre-order via IVR"}
            </Button>
          </>
        }
      >
        <form className="space-y-4" onSubmit={handleCreate}>
          <Input
            label="Place name"
            placeholder="e.g. Sharma Tea Point"
            value={form.place}
            onChange={(e) => setForm((f) => ({ ...f, place: e.target.value }))}
            required
          />
          <Select
            label="Halt type"
            value={form.type}
            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
          >
            {haltTypes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label} · ~{t.avgMins} min
              </option>
            ))}
          </Select>
          <Input
            label="Location"
            placeholder="e.g. NH-2, near Faridabad toll"
            value={form.location}
            onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
          />
          <Input
            label="What to order"
            placeholder="e.g. 2× Masala Chai"
            value={form.order}
            onChange={(e) => setForm((f) => ({ ...f, order: e.target.value }))}
          />
        </form>
      </Modal>
    </div>
  );
}
