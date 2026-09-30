import { createPortal } from "react-dom";
import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import { cn } from "../../utils/cn";

const ICONS = { green: CheckCircle2, red: TriangleAlert, ink: Info, amber: TriangleAlert, teal: Info };
const TONES = {
  green: "border-green/30 text-green-dark bg-green/5",
  red: "border-red/30 text-red-dark bg-red/5",
  ink: "border-line text-ink bg-paper",
  amber: "border-amber/40 text-amber-dark bg-amber/10",
  teal: "border-teal/30 text-teal-dark bg-teal/5",
};

export default function ToastViewport() {
  const { toasts, dismiss } = useToast();

  return createPortal(
    <div className="fixed bottom-20 left-1/2 z-[100] flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 flex-col gap-2 sm:bottom-6 sm:left-auto sm:right-6 sm:translate-x-0">
      {toasts.map((t) => {
        const Icon = ICONS[t.tone] || Info;
        return (
          <div
            key={t.id}
            role="status"
            className={cn(
              "flex items-start gap-2.5 rounded-xl border px-4 py-3 shadow-[var(--shadow-stone-lg)] animate-[fadeIn_150ms_ease-out]",
              TONES[t.tone]
            )}
          >
            <Icon size={17} className="mt-0.5 shrink-0" />
            <p className="flex-1 text-sm font-medium">{t.message}</p>
            <button onClick={() => dismiss(t.id)} aria-label="Dismiss" className="text-current/60 hover:text-current">
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>,
    document.body
  );
}
