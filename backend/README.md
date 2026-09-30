# TripLink Backend

Express + MongoDB + Socket.IO API for the TripLink smart mobility app. Pairs
with the `TripLink-react-frontend` project — every REST endpoint here returns
data shaped to match what that frontend's mock `services/*.js` files already
expect, so swapping mocks for real calls is a small, mechanical change.

## Stack

- **Express 5** — REST API
- **MongoDB + Mongoose** — data, with 2dsphere geospatial indexes for events
  and live vehicle locations
- **Socket.IO** — real-time vehicle-to-vehicle messaging and live position
  broadcasts
- **OpenStreetMap (Nominatim + OSRM)** — geocoding + driving directions for
  real trip planning. Both are free, open-source, and require **no API key,
  no account, and no payment method at all** — not even to add a card "just
  in case," unlike some other providers.
- **JWT** (via httpOnly cookie or `Authorization: Bearer`) — auth
- **Zod** — request validation

## Setup

1. **MongoDB** — either run one locally, or use a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) cluster and copy its connection string.
2. **Routing** — nothing to sign up for. Geocoding uses OpenStreetMap's
   Nominatim, and driving directions use OSRM's free public demo server by
   default (`OSRM_BASE_URL` in `.env.example`). No key, no account. If you
   outgrow the demo server's rate limits later, point `OSRM_BASE_URL` at
   your own self-hosted OSRM instance (see [project-osrm.org](https://project-osrm.org)).
3. Copy the env file and fill it in:

   ```bash
   cp .env.example .env
   ```

   ```env
   MONGO_URI=mongodb://127.0.0.1:27017/TripLink
   JWT_SECRET=some-long-random-string
   CLIENT_ORIGIN=http://localhost:5173
   OSRM_BASE_URL=https://router.project-osrm.org
   ```

4. Install and seed:

   ```bash
   npm install
   npm run seed    # creates a demo user + sample events + community posts
   npm run dev      # http://localhost:5000
   ```

   Seeded login: **demo@TripLink.app / demopass123** (a second user,
   `rohit@TripLink.app / demopass123`, exists too — useful for testing
   vehicle-to-vehicle messaging between two real accounts).

## API reference

All routes are prefixed `/api`. Routes marked 🔒 require `Authorization: Bearer <token>` (or the `token` cookie set on login).

### Auth
| Method | Path | Notes |
|---|---|---|
| POST | `/auth/signup` | `{ name, email, password }` |
| POST | `/auth/login` | `{ email, password }` |
| POST | `/auth/logout` | clears the cookie |
| GET | `/auth/me` 🔒 | current user |

### Trips
| Method | Path | Notes |
|---|---|---|
| POST | `/trips/plan` 🔒 | `{ from, to, arrivalTime?, halts? }` → geocodes both ends via OpenStreetMap Nominatim, pulls real driving routes from OSRM, checks for active events along the corridor |
| GET | `/trips/recent` 🔒 | last 10 trips |
| PATCH | `/trips/:id/start` 🔒 | mark a trip active |
| PATCH | `/trips/:id/complete` 🔒 | `{ savedMins }` — also bumps the user's `hoursSaved` stat |

### Events (exam/rally/crowd disruptions)
| Method | Path | Notes |
|---|---|---|
| GET | `/events?lng=&lat=&radiusMeters=` 🔒 | active events, optionally near a point |
| POST | `/events` 🔒 | crowdsource-report one: `{ kind, title, detail, severity, etaImpactMins, lng, lat, radiusMeters? }` |

### Vehicles (live location)
| Method | Path | Notes |
|---|---|---|
| POST | `/vehicles/position` 🔒 | `{ lng, lat, bearing?, status?, tripId? }` — upserts your live position |
| DELETE | `/vehicles/position` 🔒 | stop sharing (e.g. trip ended) |
| GET | `/vehicles/nearby?lng=&lat=&radiusMeters=` 🔒 | other users' live positions nearby |

### Messages
| Method | Path | Notes |
|---|---|---|
| GET | `/messages/:vehicleId` 🔒 | conversation history with another user |
| POST | `/messages` 🔒 | `{ vehicleId, text }` — also emitted over Socket.IO in real time |

### Smart Halts
| Method | Path | Notes |
|---|---|---|
| GET | `/halts` 🔒 | your active halts |
| POST | `/halts` 🔒 | `{ place, type, location?, order? }` — `ivrConfirmed` flips true ~4s later (stubbed IVR callback) |
| PATCH | `/halts/:id/complete` 🔒 | |
| DELETE | `/halts/:id` 🔒 | |

### Ride Circle
| Method | Path | Notes |
|---|---|---|
| GET | `/ride-circle?lng=&lat=&radiusMeters=` 🔒 | listings near a point |
| POST | `/ride-circle` 🔒 | create a listing |
| POST | `/ride-circle/:id/request` 🔒 | request a seat — notifies the owner in real time |
| GET | `/ride-circle/community/requests` 🔒 | open community posts |
| POST | `/ride-circle/community/requests` 🔒 | `{ text }` |

### Notifications
| Method | Path | Notes |
|---|---|---|
| GET | `/notifications` 🔒 | |
| PATCH | `/notifications/:id/read` 🔒 | |
| PATCH | `/notifications/read-all` 🔒 | |

### Users
| Method | Path | Notes |
|---|---|---|
| GET | `/users/me` 🔒 | |
| PUT | `/users/me` 🔒 | `{ name?, homeCity?, vehicle?, privacy? }` |

## Socket.IO

Connect with the JWT in the handshake:

```js
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  auth: { token: yourJwt },
});

socket.on("message:new", (msg) => { /* { id, from: 'them', text, kind, time } */ });
socket.on("notification:new", (n) => { /* ... */ });
socket.on("vehicle:moved", (v) => { /* { id, lng, lat, bearing, status } */ });

// Send a message (instant delivery if the recipient is connected):
socket.emit("message:send", { vehicleId, text: "Give Way" }, (ack) => {
  if (!ack.ok) console.error(ack.error);
});

// Stream your position while a trip is active:
navigator.geolocation.watchPosition((pos) => {
  socket.emit("position:update", {
    lng: pos.coords.longitude,
    lat: pos.coords.latitude,
    bearing: pos.coords.heading ?? 0,
  });
});
```

## Wiring this into the existing frontend

The frontend's `src/services/*.js` files are the only place that needs to
change — each mock function gets replaced with a real `fetch`/`axios` call.
For example:

```js
// frontend: src/services/routeService.js
import { api } from "./api";

export async function planTrip({ from, to, arrivalTime, halts }) {
  return api.post("/trips/plan", { from, to, arrivalTime, halts });
}
```

and point `API_BASE_URL` (in the frontend's `services/api.js`) at
`http://localhost:5000/api`. The frontend already sends/expects the same
field names used here (`from`, `to`, `etaMins`, `distanceKm`, `roadType`,
etc.), so no UI component changes are needed — only the service layer.

For the Live Map page specifically, you'd also want to:
1. Call `POST /vehicles/position` (or emit `position:update`) once you have
   the browser's real geolocation.
2. Poll or socket-subscribe to `GET /vehicles/nearby` instead of the static
   mock array.

## Project structure

```text
src/
├── config/        # env.js, db.js
├── models/         # Mongoose schemas
├── controllers/     # request handlers
├── routes/          # Express routers
├── middleware/       # auth (JWT), error handling, zod validation
├── services/         # osmService.js (Nominatim + OSRM), routeEngine.js
├── sockets/           # Socket.IO server + handlers
├── utils/             # geo math, validators, seed script
├── app.js
└── server.js
```

## A note on what's real vs. stubbed

- **Real**: auth, MongoDB persistence, OpenStreetMap geocoding/directions, event
  geospatial matching, Socket.IO real-time messaging, notifications.
- **Stubbed** (clearly marked in code — see `haltController.js`): the IVR
  phone call for Smart Halts. Wiring in a real call requires a telephony
  account (e.g. Twilio Voice); the endpoint shape is already built so that's
  a drop-in swap when you're ready.

## A note on the OSRM public demo server

`OSRM_BASE_URL` defaults to `router.project-osrm.org`, OSRM's free public
instance. It's meant for evaluation and light use — no key required, but
also no uptime guarantee and a fair-use rate limit. That's fine for
development and demos. For anything closer to production, self-host OSRM
(it's open source and Docker-friendly — see the
[OSRM quickstart](https://github.com/Project-OSRM/osrm-backend#running-osrm))
and point `OSRM_BASE_URL` at your own instance; no code changes needed
beyond that env var.

Similarly, Nominatim's hosted instance asks that you keep request volume
light and identify your app via a `User-Agent` header — already set in
`osmService.js`. For heavier traffic, self-hosting Nominatim or using a
provider that mirrors its data (e.g. Geoapify's free tier) is the next step.
