const EARTH_RADIUS_M = 6371000;

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

/** Great-circle distance between two [lng, lat] points, in meters. */
export function haversineMeters([lng1, lat1], [lng2, lat2]) {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_M * c;
}

/**
 * Whether an event's influence radius intersects a route's geometry, by
 * sampling the route's coordinates. Cheap and good enough at city scale —
 * a proper implementation would use a spatial index / line-buffer query.
 */
export function routePassesNearEvent(routeCoordinates, event) {
  if (!routeCoordinates?.length) return false;
  const [eventLng, eventLat] = event.location.coordinates;
  return routeCoordinates.some(
    ([lng, lat]) => haversineMeters([lng, lat], [eventLng, eventLat]) <= event.radiusMeters
  );
}
