import { cn } from "../../utils/cn";

// Indian national/state highways use painted "kilometer stones" — a curved
// top band colour-coded by road authority (yellow = national highway,
// green = state highway) over a white body with the distance in bold digits.
// That object is the visual signature for Vikas's stat callouts: it's a
// real artifact from the exact roads this product is built for.

const BANDS = {
  amber: "bg-amber",
  green: "bg-green",
  ink: "bg-ink",
  teal: "bg-teal",
  red: "bg-red",
};

export default function MilestoneStat({ value, unit, label, band = "amber", className }) {
  return (
    <div
      className={cn(
        "milestone-top w-full max-w-[168px] overflow-hidden border border-ink/10 bg-paper shadow-[var(--shadow-stone)]",
        className
      )}
    >
      <div className={cn("h-3.5 w-full", BANDS[band])} />
      <div className="px-4 py-4 sm:py-5 text-center">
        <div className="font-mono-tab font-display text-3xl sm:text-4xl font-bold text-ink leading-none">
          {value}
          {unit && <span className="text-lg align-top ml-0.5">{unit}</span>}
        </div>
        <p className="mt-2 text-xs sm:text-[13px] leading-snug text-ink/60">{label}</p>
      </div>
    </div>
  );
}
