import { cn } from "../../utils/cn";

const TONES = {
  amber: "bg-amber/15 text-amber-dark",
  teal: "bg-teal/10 text-teal-dark",
  green: "bg-green/10 text-green-dark",
  red: "bg-red/10 text-red-dark",
  ink: "bg-ink/8 text-ink",
  mist: "bg-mist text-ink/70",
};

export default function StatusPill({ tone = "ink", children, className, dot = false }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
        TONES[tone],
        className
      )}
    >
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full", `bg-current`)} />}
      {children}
    </span>
  );
}
