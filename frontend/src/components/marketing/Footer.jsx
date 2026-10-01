import { Milestone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-ink text-paper/70">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber text-ink">
                <Milestone size={16} strokeWidth={2.5} />
              </span>
              <span className="font-display text-base font-bold text-paper">VASUNDHARA</span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-paper/50">
              Smart mobility for roads that don't behave like the map says they will.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-paper/40">Product</p>
              <ul className="mt-3 space-y-2 text-sm text-paper/60">
                <li><a href="/#solution" className="hover:text-paper">How it works</a></li>
                <li><a href="/#features" className="hover:text-paper">Features</a></li>
                <li><a href="/#feasibility" className="hover:text-paper">Feasibility</a></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-paper/40">Team</p>
              <ul className="mt-3 space-y-2 text-sm text-paper/60">
                <li>Team VASUNDHARA</li>
                <li>PS Category — Software</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-paper/10 pt-6 text-xs text-paper/35">
          © {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
}
