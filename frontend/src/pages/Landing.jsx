import { Link } from "react-router-dom";
import {
  ArrowRight,
  GraduationCap,
  Megaphone,
  Users2,
  RadioTower,
  Coffee,
  Users,
  BellRing,
  TrendingUp,
  ShieldCheck,
  Check,
  X,
} from "lucide-react";
import Button from "../components/ui/Button";
import MilestoneStat from "../components/ui/MilestoneStat";
import FeatureCard from "../components/marketing/FeatureCard";
import RouteMapCanvas from "../components/app/RouteMapCanvas";
import { marketInsights } from "../data/routes";
import { nearbyVehicles } from "../data/vehicles";

const FEATURES = [
  { icon: RadioTower, title: "Live event detection", body: "Exams, rallies, and sudden crowd surges get folded into your route before you hit them, not after." },
  { icon: Users2, title: "Vehicle interaction layer", body: "See nearby vehicles as icons on the map. Tap one to send \"Give Way\" or \"Emergency\", instantly." },
  { icon: Coffee, title: "Smart Halt System", body: "Pre-order tea, food, or fuel via IVR. An automatic timer and reminder gets you back on the road on time." },
  { icon: Users, title: "Ride Circle", body: "Connect with commuters heading the same way and coordinate rides, in real time." },
  { icon: TrendingUp, title: "Predictive routing", body: "Departure-time suggestions and crowd forecasts, not just turn-by-turn directions." },
  { icon: BellRing, title: "Smart alerts", body: "Get nudged before congestion forms, with enough runway to actually reroute." },
];

const COMPARISON = [
  { feature: "Traffic response", Vikas: "Dynamic, tuned to Indian road conditions", standard: "Static / historical" },
  { feature: "Social layer", Vikas: "Peer-to-peer \"Give Way\" messaging", standard: "None" },
  { feature: "Halt logic", Vikas: "Smart pre-orders via IVR", standard: "Manual search" },
];

export default function Landing() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-amber/15 px-3 py-1 text-xs font-semibold text-amber-dark">
              Hacknovate 7.0 · Smart Mobility &amp; Intelligent Transportation
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.08] text-ink sm:text-5xl lg:text-6xl">
              Traffic apps show you roads.
              <br />
              <span className="text-teal">Vikas shows you what's happening on them.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink/60 sm:text-lg">
              Standard GPS routes around yesterday's traffic. Vikas routes around today's exam,
              this afternoon's rally, and the crowd surge that started ten minutes ago — then lets
              you coordinate directly with the vehicles around you.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button as={Link} to="/signup" variant="amber" size="lg" icon={ArrowRight} iconPosition="right">
                Launch the app
              </Button>
              <Button as="a" href="#solution" variant="outline" size="lg">
                See how it works
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap gap-3.5">
              {marketInsights.map((m) => (
                <MilestoneStat
                  key={m.id}
                  value={m.stat}
                  label={m.label}
                  band={m.id === "mi1" ? "amber" : m.id === "mi2" ? "green" : "teal"}
                />
              ))}
            </div>
          </div>

          <div>
            <RouteMapCanvas vehicles={nearbyVehicles.slice(0, 3)} className="aspect-[4/3.4] shadow-[var(--shadow-stone-lg)]" />
          </div>
        </div>
      </section>

      {/* Problem */}
      <section id="problem" className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-dark">The problem</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-ink sm:text-4xl">
            Urban travel breaks in ways navigation apps don't watch for.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink/60">
            Existing apps route on historical averages. They miss the board exam letting out at
            9 AM, the rally closing off C-Hexagon, the market that suddenly floods with a weekend
            crowd — the disruptions that actually decide whether you're on time.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            { icon: GraduationCap, label: "Exam-day crowds", classes: "bg-amber/15 text-amber-dark" },
            { icon: Megaphone, label: "Rallies & closures", classes: "bg-red/10 text-red-dark" },
            { icon: Users2, label: "Sudden crowd surges", classes: "bg-teal/10 text-teal-dark" },
          ].map((d) => (
            <div key={d.label} className="flex items-center gap-3 rounded-2xl border border-line p-4">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${d.classes}`}>
                <d.icon size={18} />
              </div>
              <p className="text-sm font-semibold text-ink">{d.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Unique solution */}
      <section id="solution" className="border-y border-line bg-mist">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-dark">The unique solution</p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold text-ink sm:text-4xl">
            When one commuter has time to spare and another doesn't, Vikas lets them say so.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink/60">
            If someone's running early and someone else is running late on the same stretch of
            road, they can signal each other directly — a "Give Way" tap — and the routing
            algorithm keeps traffic moving instead of letting one delay cascade into a jam.
            It's peer coordination, layered on top of live event detection, tuned for how Indian
            roads actually behave.
          </p>

          <div className="mt-10 overflow-hidden rounded-2xl border border-line bg-paper">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-line bg-ink text-paper">
                  <th className="px-5 py-3.5 font-semibold">Feature</th>
                  <th className="px-5 py-3.5 font-semibold text-amber">Vikas</th>
                  <th className="px-5 py-3.5 font-semibold text-paper/50">Standard GPS</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={row.feature} className={i !== COMPARISON.length - 1 ? "border-b border-line" : ""}>
                    <td className="px-5 py-4 font-semibold text-ink">{row.feature}</td>
                    <td className="px-5 py-4 text-ink/70">
                      <span className="inline-flex items-center gap-1.5">
                        <Check size={15} className="text-green shrink-0" /> {row.Vikas}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-ink/40">
                      <span className="inline-flex items-center gap-1.5">
                        <X size={15} className="text-ink/30 shrink-0" /> {row.standard}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-dark">What's inside</p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold text-ink sm:text-4xl">
          Six systems, working from the same live picture of the road.
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </section>

      {/* Feasibility */}
      <section id="feasibility" className="border-t border-line bg-ink text-paper">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-amber" />
            <p className="text-xs font-semibold uppercase tracking-wide text-paper/50">Feasibility</p>
          </div>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold sm:text-4xl">
            Built on APIs that already exist, not ones we're hoping get built.
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              { title: "Technical", body: "Google Maps / Mapbox for routing, Firebase or WebSockets for live coordination — no novel infrastructure required." },
              { title: "Economical", body: "Cloud-native from day one (AWS / Firebase), so there's no upfront hardware cost to launch." },
              { title: "Security", body: "End-to-end encryption and secure auth are part of the architecture, not an afterthought." },
            ].map((c) => (
              <div key={c.title} className="rounded-2xl border border-paper/15 p-5">
                <h3 className="font-display text-base font-semibold text-amber">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-paper/60">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24 text-center">
        <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">Try the Vikas prototype</h2>
        <p className="mx-auto mt-3 max-w-md text-ink/55">
          Every screen here runs on mock data so you can explore the full commuter flow end to end.
        </p>
        <div className="mt-7 flex justify-center gap-3">
          <Button as={Link} to="/signup" variant="amber" size="lg" icon={ArrowRight} iconPosition="right">
            Create a free account
          </Button>
        </div>
      </section>
    </div>
  );
}
