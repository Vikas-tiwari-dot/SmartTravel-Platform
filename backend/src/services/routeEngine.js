import * as osm from "./osmService.js";
import Event from "../models/Event.js";
import { routePassesNearEvent, haversineMeters } from "../utils/geo.js";

const ROAD_TYPES = ["NH", "SH", "City"];
const LABELS = ["Smart Route", "Alternate Route", "Scenic / Low-traffic"];

/**
 * Plans a trip: geocodes both ends, pulls real driving routes from OSRM,
 * finds active events near the corridor, and folds their ETA impact into
 * each route option — the same shape the frontend's mock data used, so the
 * UI doesn't need to change.
 */
export async function planTrip({ from, to, halts = [] }) {
  const [fromPlace, toPlace] = await Promise.all([osm.geocode(from), osm.geocode(to)]);

  const rawRoutes = await osm.getDirections(fromPlace.coordinates, toPlace.coordinates);

  // Active events anywhere near the midpoint corridor (cheap city-scale radius search).
  const midpoint = [
    (fromPlace.coordinates[0] + toPlace.coordinates[0]) / 2,
    (fromPlace.coordinates[1] + toPlace.coordinates[1]) / 2,
  ];
  const corridorRadiusMeters = Math.max(
    8000,
    haversineMeters(fromPlace.coordinates, toPlace.coordinates) / 1.5
  );
  const nearbyEvents = await Event.find({
    active: true,
    location: {
      $geoWithin: { $centerSphere: [midpoint, corridorRadiusMeters / 6378100] },
    },
  });

  const routes = rawRoutes.map((r, i) => {
    const coords = r.geometry?.coordinates || [];
    const affectingEvents = nearbyEvents.filter((ev) => routePassesNearEvent(coords, ev));
    const delayMins = affectingEvents.reduce((sum, ev) => sum + ev.etaImpactMins, 0);
    const crowdLevel = delayMins === 0 ? "light" : delayMins <= 10 ? "moderate" : "heavy";

    return {
      id: `route-${i}`,
      label: LABELS[i] || `Route ${i + 1}`,
      roadType: ROAD_TYPES[i % ROAD_TYPES.length],
      recommended: i === 0 && affectingEvents.length === 0,
      distanceKm: r.distanceKm,
      etaMins: r.etaMins + delayMins,
      delayMins,
      crowdLevel,
      notes:
        affectingEvents.length > 0
          ? `Passes near: ${affectingEvents.map((e) => e.title).join(", ")}`
          : "No active disruptions detected on this route.",
      waypoints: [fromPlace.placeName, toPlace.placeName],
      geometry: r.geometry,
    };
  });

  // If more than one route is disruption-free, mark the fastest of those recommended.
  if (!routes.some((r) => r.recommended)) {
    const best = [...routes].sort((a, b) => a.etaMins - b.etaMins)[0];
    if (best) best.recommended = true;
  }

  return {
    from: fromPlace.placeName,
    to: toPlace.placeName,
    fromCoords: { lng: fromPlace.coordinates[0], lat: fromPlace.coordinates[1] },
    toCoords: { lng: toPlace.coordinates[0], lat: toPlace.coordinates[1] },
    halts,
    events: nearbyEvents.map((e) => e.toPublicJSON()),
    routes,
  };
}
