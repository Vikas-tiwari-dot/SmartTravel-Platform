# Vikas — Smart Mobility Frontend

A React frontend for **Vikas**, a smart mobility concept for unpredictable Indian
roads, built from the Hacknovate 7.0 idea-submission deck (problem statement,
architecture, feasibility, and impact slides).

## What's implemented

The deck describes a routing system that reacts to live events (exams, rallies,
crowd surges), a vehicle-to-vehicle interaction layer for peer coordination, a
Smart Halt System with IVR pre-orders, and ride-sharing between commuters on the
same route. Each of those is a real, working screen here (on mock data):

- **Landing page** — problem statement, unique-solution comparison table, feature
  grid, and feasibility section, all pulled from the deck's content.
- **Auth** — Login / Signup (mock, any credentials work).
- **Dashboard** — trip-planning shortcut, monthly stats, recent trips, detected
  live events.
- **Plan a Trip** — from/to/arrival-time/halts form -> route options ranked
  against live-event impact.
- **Live Map** — a stylized SVG road map with nearby vehicles as tappable icons;
  tapping one opens a quick-message panel (Give Way / Emergency / Thanks /
  custom message).
- **Smart Halts** — add a halt (tea, dining, hotel, fuel, restroom), see its IVR
  pre-order status and a live countdown timer.
- **Ride Circle** — commuters sharing your route, request a ride-share, see
  open community requests.
- **Notifications** — event, message, halt, and ride alerts with read/unread state.
- **Profile** — account, vehicle, and privacy settings.

## Stack

React 19 + Vite + React Router + Tailwind CSS v4 + lucide-react icons.

## Design system

The visual language is built around **kilometer stones** — the color-coded
milestone markers used on Indian highways (amber tops for national highways,
green for state highways) — reused here as the stat-card motif (see
`MilestoneStat`), instead of a generic dashboard template. Type pairing is
Space Grotesk (display) + Manrope (body) + JetBrains Mono (distances, ETAs,
timers).

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL. Log in with any email/password (it's a mock
auth service) to reach the app shell at `/app`.

## Project structure

```text
src/
├── components/
│   ├── ui/           # Button, Card, Modal, Input, Tabs, Toast, etc.
│   ├── app/           # Sidebar, Topbar, RouteMapCanvas, VehicleMarker, ...
│   └── marketing/      # Navbar, Footer, FeatureCard for the landing page
├── pages/             # One component per route
├── layouts/            # MarketingLayout, AppLayout (shell + nav)
├── routes/             # ProtectedRoute
├── context/            # AuthContext, ToastContext
├── services/            # API-ready service layer (see below)
├── hooks/              # useCountdown, etc.
├── data/               # Mock data backing the services
└── utils/              # cn() className helper
```

## Connecting a real backend

Every page talks to `src/services/*`, not directly to mock data — swap the
body of each service function for a real `api.get/post/...` call (see
`services/api.js`) and the UI keeps working unchanged. For example:

```js
// services/routeService.js
export async function planTrip({ from, to, arrivalTime, halts }) {
  return api.post("/routes/plan", { from, to, arrivalTime, halts });
}
```

The Live Map's vehicle layer is written to be swapped for a WebSocket feed
(`services/vehicleService.js`) once real-time positions are available — the
deck's architecture diagram calls for socket connectivity there.
