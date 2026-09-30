import { useEffect, useRef, useState, useCallback } from "react";
import { Send, X, TriangleAlert, Hand, ThumbsUp, Gauge } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import StatusPill from "../components/ui/StatusPill";
import LiveMapView from "../components/app/LiveMapView";
import { PageLoader } from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import { quickMessages } from "../data/vehicles";
import {
  getNearbyVehicles,
  getConversation,
  sendQuickMessage,
  sharePosition,
  stopSharingPosition,
  getCurrentCoords,
} from "../services/vehicleService";
import { getSocket } from "../services/socketService";
import { useToast } from "../context/ToastContext";
import { cn } from "../utils/cn";

const STATUS_LABEL = { "running-late": "Running late", "on-time": "On time", "running-early": "Running early" };
const STATUS_TONE = { "running-late": "amber", "on-time": "teal", "running-early": "green" };
const STATUS_RING_CLASS = { "running-late": "ring-amber", "on-time": "ring-teal", "running-early": "ring-green" };
const QUICK_ICON = { "give-way": Hand, emergency: TriangleAlert, thanks: ThumbsUp, "slow-down": Gauge };

const REFRESH_INTERVAL_MS = 8000;

export default function LiveMap() {
  const [vehicles, setVehicles] = useState(null);
  const [myCoords, setMyCoords] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const { notify } = useToast();
  const scrollRef = useRef(null);
  const selectedRef = useRef(null);
  selectedRef.current = selected;

  const refreshVehicles = useCallback(async () => {
    try {
      const list = await getNearbyVehicles();
      setVehicles(list);
      setLoadError(null);
    } catch (err) {
      setLoadError(err.message);
    }
  }, []);

  useEffect(() => {
    getCurrentCoords().then(setMyCoords);
    sharePosition().catch(() => {});
    refreshVehicles();
    const interval = setInterval(refreshVehicles, REFRESH_INTERVAL_MS);
    return () => {
      clearInterval(interval);
      stopSharingPosition().catch(() => {});
    };
  }, [refreshVehicles]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return undefined;

    function handleMoved(update) {
      setVehicles((prev) =>
        prev
          ? prev.map((v) =>
              v.id === update.id
                ? { ...v, status: update.status, lat: update.lat, lng: update.lng, bearing: update.bearing }
                : v
            )
          : prev
      );
    }
    function handleNewMessage(msg) {
      if (selectedRef.current && msg.from === "them") {
        setConversation((c) => [...c, msg]);
      }
    }

    socket.on("vehicle:moved", handleMoved);
    socket.on("message:new", handleNewMessage);
    return () => {
      socket.off("vehicle:moved", handleMoved);
      socket.off("message:new", handleNewMessage);
    };
  }, []);

  useEffect(() => {
    if (!selected) return;
    getConversation(selected.id).then(setConversation);
  }, [selected]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [conversation]);

  async function handleSend(text) {
    if (!text.trim() || !selected) return;
    setSending(true);
    try {
      const msg = await sendQuickMessage({ vehicleId: selected.id, text });
      setConversation((c) => [...c, msg]);
      setDraft("");
      if (text === "Emergency") notify(`Emergency alert sent to ${selected.label}`, { tone: "red" });
    } catch (err) {
      notify(err.message, { tone: "red" });
    } finally {
      setSending(false);
    }
  }

  if ((!vehicles && !loadError) || !myCoords) return <PageLoader label="Locating you and nearby vehicles…" />;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div>
        <LiveMapView
          center={myCoords}
          vehicles={vehicles || []}
          activeVehicleId={selected?.id}
          onSelectVehicle={setSelected}
          className="aspect-[4/3.6] sm:aspect-4/3 rounded-2xl border border-line"
        />
        <p className="mt-3 text-xs text-ink/40">
          Tap any vehicle icon to open a quick message. Ring color shows their schedule status.
        </p>
        <div className="mt-3 flex flex-wrap gap-3 text-xs text-ink/50">
          {Object.entries(STATUS_LABEL).map(([key, label]) => (
            <span key={key} className="flex items-center gap-1.5">
              <span className={cn("h-2.5 w-2.5 rounded-full ring-2", STATUS_RING_CLASS[key], "bg-paper")} />
              {label}
            </span>
          ))}
        </div>
        {loadError && (
          <p className="mt-3 text-xs font-medium text-red">
            Couldn't reach the live map service: {loadError}
          </p>
        )}
        {vehicles && vehicles.length === 0 && !loadError && (
          <div className="mt-4">
            <EmptyState
              title="No one nearby right now"
              body="As other SAKSHAM users share their live position within 1.5km, they'll show up here."
            />
          </div>
        )}
      </div>

      <Card padded={false} className="flex h-130 flex-col overflow-hidden">
        {!selected ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
            <p className="font-display text-base font-semibold text-ink">Nobody selected yet</p>
            <p className="text-sm text-ink/45">Tap a vehicle on the map to start a conversation.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between border-b border-line px-4 py-3.5">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">{selected.label}</p>
                <div className="mt-0.5 flex items-center gap-2">
                  <StatusPill tone={STATUS_TONE[selected.status]}>{STATUS_LABEL[selected.status]}</StatusPill>
                  <span className="text-xs text-ink/40">{selected.distanceM}m away</span>
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                aria-label="Close conversation"
                className="rounded-lg p-1.5 text-ink/40 hover:bg-mist hover:text-ink"
              >
                <X size={16} />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {conversation.length === 0 ? (
                <p className="py-8 text-center text-sm text-ink/40">
                  No messages yet — send a quick "Give Way" to open the line.
                </p>
              ) : (
                conversation.map((m) => (
                  <div key={m.id} className={cn("flex", m.from === "me" ? "justify-end" : "justify-start")}>
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-3.5 py-2 text-sm",
                        m.from === "me" ? "bg-ink text-paper rounded-br-sm" : "bg-mist text-ink rounded-bl-sm"
                      )}
                    >
                      {m.text}
                      <p className={cn("mt-1 text-[10px]", m.from === "me" ? "text-paper/40" : "text-ink/35")}>{m.time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-line p-3.5">
              <div className="mb-2.5 flex flex-wrap gap-1.5">
                {quickMessages.map((q) => {
                  const Icon = QUICK_ICON[q.id];
                  return (
                    <button
                      key={q.id}
                      onClick={() => handleSend(q.label)}
                      disabled={sending}
                      className={cn(
                        "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50",
                        q.tone === "red"
                          ? "border-red/30 text-red-dark hover:bg-red/10"
                          : q.tone === "amber"
                          ? "border-amber/40 text-amber-dark hover:bg-amber/10"
                          : q.tone === "teal"
                          ? "border-teal/30 text-teal-dark hover:bg-teal/10"
                          : "border-line text-ink/60 hover:bg-mist"
                      )}
                    >
                      <Icon size={13} /> {q.label}
                    </button>
                  );
                })}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(draft);
                }}
                className="flex gap-2"
              >
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Write a message…"
                  className="flex-1 rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal"
                />
                <Button type="submit" variant="teal" size="md" icon={Send} disabled={sending || !draft.trim()} aria-label="Send message" />
              </form>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}