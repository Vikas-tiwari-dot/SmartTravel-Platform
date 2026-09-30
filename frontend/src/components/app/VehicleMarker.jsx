import { Car, Bike, Bus, Navigation } from "lucide-react";
import { cn } from "../../utils/cn";

const ICONS = { car: Car, scooter: Bike, auto: Navigation, bus: Bus };
const STATUS_RING = {
  "running-late": "ring-amber",
  "on-time": "ring-teal",
  "running-early": "ring-green",
};

export default function VehicleMarker({ vehicle, active, onSelect }) {
  const Icon = ICONS[vehicle.type] || Car;
  return (
    <button
      type="button"
      onClick={() => onSelect(vehicle)}
      style={{ left: `${vehicle.x}%`, top: `${vehicle.y}%` }}
      className={cn(
        "group absolute -translate-x-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-paper ring-2 shadow-[var(--shadow-stone)] transition-transform hover:scale-110 focus-visible:scale-110",
        STATUS_RING[vehicle.status],
        active && "scale-125 ring-[3px]"
      )}
      aria-label={`${vehicle.label}, ${vehicle.distanceM}m away, tap to message`}
    >
      <Icon
        size={16}
        strokeWidth={2.25}
        className="text-ink"
        style={{ transform: `rotate(${vehicle.bearing}deg)` }}
      />
      <span className="pointer-events-none absolute -bottom-1.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-current opacity-0 group-hover:opacity-100" />
    </button>
  );
}
