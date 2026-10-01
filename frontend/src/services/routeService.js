import { api } from "./api";

/**
 * Plans a trip. Backend geocodes from/to via OpenStreetMap, pulls real
 * driving routes from OSRM, and cross-checks active events along the
 * corridor — see VASUNDHARA-backend/src/services/routeEngine.js.
 */
export async function planTrip({ from, to, arrivalTime, halts }) {
  return api.post("/trips/plan", { from, to, arrivalTime: arrivalTime || null, halts: halts || [] });
}

export async function getRecentTrips() {
  const trips = await api.get("/trips/recent");
  // Backend already returns { from, to, date, savedMins, ... } per trip.
  return trips;
}

export async function getDetectedEvents() {
  return api.get("/events");
}
