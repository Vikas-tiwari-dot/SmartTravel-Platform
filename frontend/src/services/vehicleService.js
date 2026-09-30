import { api } from "./api";
import { getSocket } from "./socketService";

const DEFAULT_COORDS = { lng: 77.2432, lat: 28.5677 }; // Lajpat Nagar, Delhi fallback
const NEARBY_RADIUS_METERS = 1500;

/** Resolves once with the browser's location, or a Delhi default if unavailable/denied. */
export function getCurrentCoords() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(DEFAULT_COORDS);
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lng: pos.coords.longitude, lat: pos.coords.latitude }),
      () => resolve(DEFAULT_COORDS),
      { timeout: 4000, maximumAge: 30000 }
    );
  });
}

/** Initial compass bearing (0-360 deg) from point A to point B. */
function bearingFromTo(from, to) {
  const toRad = (d) => (d * Math.PI) / 180;
  const phi1 = toRad(from.lat);
  const phi2 = toRad(to.lat);
  const deltaLambda = toRad(to.lng - from.lng);
  const y = Math.sin(deltaLambda) * Math.cos(phi2);
  const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

/**
 * Maps a real [lng, lat] + distance into an x/y percentage position on the
 * app's stylized SVG map (which isn't drawn to real-world scale), so the
 * live layout still "points the right way" relative to the viewer.
 */
function toCanvasPosition(myCoords, vehicleCoords, distanceM) {
  const bearing = bearingFromTo(myCoords, vehicleCoords);
  const bearingRad = (bearing * Math.PI) / 180;
  const scale = 12 + Math.min(distanceM / NEARBY_RADIUS_METERS, 1) * 33; // 12-45% from center
  return {
    x: 50 + Math.sin(bearingRad) * scale,
    y: 50 - Math.cos(bearingRad) * scale,
  };
}

/** Nearby vehicles, positioned on the stylized map relative to the caller's real location. */
export async function getNearbyVehicles() {
  const myCoords = await getCurrentCoords();
  const vehicles = await api.get(
    `/vehicles/nearby?lng=${myCoords.lng}&lat=${myCoords.lat}&radiusMeters=${NEARBY_RADIUS_METERS}`
  );

  return vehicles.map((v) => ({
    ...v,
    ...toCanvasPosition(myCoords, { lng: v.lng, lat: v.lat }, v.distanceM),
  }));
}

/** Publishes the caller's live position (REST -- always available even without a socket). */
export async function sharePosition({ bearing = 0, status = "on-time", tripId = null } = {}) {
  const coords = await getCurrentCoords();
  return api.post("/vehicles/position", { ...coords, bearing, status, tripId });
}

export async function stopSharingPosition() {
  await api.delete("/vehicles/position");
  return true;
}

export async function getConversation(vehicleId) {
  return api.get(`/messages/${vehicleId}`);
}

const QUICK_KIND_BY_TEXT = {
  "Give Way": "give-way",
  Emergency: "emergency",
  "Thanks!": "thanks",
  "Slowing down": "slow-down",
};

/**
 * Sends a message. Prefers the live socket (instant delivery, no extra
 * round trip) and falls back to REST if the socket isn't connected --
 * both paths persist the message and notify the recipient the same way.
 */
export async function sendQuickMessage({ vehicleId, text }) {
  const socket = getSocket();
  const kind = QUICK_KIND_BY_TEXT[text] || "custom";

  if (socket?.connected) {
    return new Promise((resolve, reject) => {
      socket.emit("message:send", { vehicleId, text, kind }, (ack) => {
        if (ack?.ok) resolve(ack.message);
        else reject(new Error(ack?.error || "Message failed to send."));
      });
    });
  }

  return api.post("/messages", { vehicleId, text });
}
