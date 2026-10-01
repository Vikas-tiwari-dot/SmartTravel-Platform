import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Milestone } from "lucide-react";
import Button from "../ui/Button";
import { cn } from "../../utils/cn";

const LINKS = [
  { to: "/#problem", label: "Problem" },
  { to: "/#solution", label: "Solution" },
  { to: "/#features", label: "Features" },
  { to: "/#feasibility", label: "Feasibility" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink text-amber">
            <Milestone size={18} strokeWidth={2.25} />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">VASUNDHARA</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {LINKS.map((l) => (
            <a key={l.to} href={l.to} className="text-sm font-medium text-ink/60 hover:text-ink transition-colors">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button as={Link} to="/login" variant="ghost" size="sm">
            Log in
          </Button>
          <Button as={Link} to="/signup" variant="amber" size="sm">
            Launch app
          </Button>
        </div>

        <button
          className="md:hidden text-ink"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div
        className={cn(
          "md:hidden overflow-hidden border-t border-line bg-paper transition-[max-height] duration-200",
          open ? "max-h-80" : "max-h-0 border-t-0"
        )}
      >
        <div className="flex flex-col gap-1 px-5 py-4">
          {LINKS.map((l) => (
            <a
              key={l.to}
              href={l.to}
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-2.5 text-sm font-medium text-ink/70 hover:bg-mist"
            >
              {l.label}
            </a>
          ))}
          <div className="mt-2 flex gap-2">
            <Button as={Link} to="/login" variant="outline" size="sm" className="flex-1 justify-center">
              Log in
            </Button>
            <Button as={Link} to="/signup" variant="amber" size="sm" className="flex-1 justify-center">
              Launch app
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
