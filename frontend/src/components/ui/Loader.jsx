import { cn } from "../../utils/cn";

export function Spinner({ size = 18, className }) {
  return (
    <svg
      className={cn("animate-spin", className)}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.2" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function Skeleton({ className }) {
  return <div className={cn("animate-pulse rounded-lg bg-mist-dark", className)} />;
}

export function PageLoader({ label = "Loading…" }) {
  return (
    <div className="flex h-64 flex-col items-center justify-center gap-3 text-ink/40">
      <Spinner size={28} />
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}
