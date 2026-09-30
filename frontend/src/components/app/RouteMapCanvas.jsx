import { Navigation } from "lucide-react";
import VehicleMarker from "./VehicleMarker";
import { cn } from "../../utils/cn";

/**
 * A deliberately stylized road-grid map rendered in SVG/CSS rather than an
 * external maps image — keeps the app self-contained and license-free while
 * still reading clearly as "you are here, on a road network."
 */
export default function RouteMapCanvas({ vehicles = [], activeVehicleId, onSelectVehicle, className, bearing = 0 }) {
  return (
    <div className={cn("relative w-full overflow-hidden rounded-2xl border border-line bg-mist", className)}>
      <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
        <rect width="400" height="300" fill="var(--color-mist)" />
        {/* minor grid */}
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="300" stroke="var(--color-mist-dark)" strokeWidth="1" />
        ))}
        {Array.from({ length: 7 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 50} x2="400" y2={i * 50} stroke="var(--color-mist-dark)" strokeWidth="1" />
        ))}
        {/* main roads */}
        <path d="M0 150 H400" stroke="#ffffff" strokeWidth="22" />
        <path d="M0 150 H400" stroke="var(--color-ink)" strokeOpacity="0.08" strokeWidth="22" fill="none" />
        <path d="M0 150 H400" stroke="#ffffff" strokeDasharray="10 10" strokeWidth="1.5" opacity="0" />
        <path d="M120 0 V300" stroke="#ffffff" strokeWidth="16" />
        <path d="M300 0 V300" stroke="#ffffff" strokeWidth="16" />
        <path d="M0 60 H400" stroke="#ffffff" strokeWidth="10" opacity="0.7" />
        <path d="M0 240 H400" stroke="#ffffff" strokeWidth="10" opacity="0.7" />

        {/* TripLink smart route, highlighted */}
        <path
          d="M0 150 C 90 150, 100 60, 190 60 S 280 150, 400 150"
          stroke="var(--color-teal)"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="1 10"
        />
        <path
          d="M0 150 C 90 150, 100 60, 190 60 S 280 150, 400 150"
          stroke="var(--color-teal)"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
      </svg>

      {/* current-position marker with bearing */}
      <div
        className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-teal text-paper shadow-[var(--shadow-stone)]"
        aria-hidden="true"
      >
        <span className="absolute h-11 w-11 animate-ping rounded-full bg-teal/30" />
        <Navigation size={18} style={{ transform: `rotate(${bearing}deg)` }} strokeWidth={2.5} />
      </div>

      {vehicles.map((v) => (
        <VehicleMarker key={v.id} vehicle={v} active={v.id === activeVehicleId} onSelect={onSelectVehicle} />
      ))}
    </div>
  );
}
