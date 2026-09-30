import { cn } from "../../utils/cn";

export default function Tabs({ tabs, active, onChange, className }) {
  return (
    <div
      role="tablist"
      className={cn("flex gap-1 rounded-xl bg-mist p-1 w-fit overflow-x-auto scrollbar-none", className)}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              "rounded-lg px-3.5 py-2 text-sm font-semibold whitespace-nowrap transition-colors",
              isActive ? "bg-paper text-ink shadow-[var(--shadow-stone)]" : "text-ink/50 hover:text-ink"
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
