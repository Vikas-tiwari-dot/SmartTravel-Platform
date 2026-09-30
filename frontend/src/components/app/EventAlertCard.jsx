import { GraduationCap, Megaphone, Users2, Clock } from "lucide-react";
import StatusPill from "../ui/StatusPill";
import { cn } from "../../utils/cn";

const KIND_ICON = { exam: GraduationCap, rally: Megaphone, crowd: Users2 };
const SEVERITY_TONE = { high: "red", medium: "amber", low: "teal" };

export default function EventAlertCard({ event }) {
  const Icon = KIND_ICON[event.kind] || Megaphone;
  return (
    <div className="flex items-start gap-3.5 rounded-2xl border border-line bg-paper p-4">
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
          event.severity === "high" ? "bg-red/10 text-red" : event.severity === "medium" ? "bg-amber/15 text-amber-dark" : "bg-teal/10 text-teal-dark"
        )}
      >
        <Icon size={18} strokeWidth={2} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="text-sm font-semibold text-ink">{event.title}</h4>
          <StatusPill tone={SEVERITY_TONE[event.severity]}>{event.severity} impact</StatusPill>
        </div>
        <p className="mt-1 text-sm text-ink/55">{event.detail}</p>
        <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-ink/45">
          <Clock size={13} /> +{event.etaImpactMins} min if unrouted
        </p>
      </div>
    </div>
  );
}
