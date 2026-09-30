import axios from "axios";
import { env } from "../config/env.js";

// Nominatim (OpenStreetMap's geocoder) and OSRM (Open Source Routing
// Machine) are both free, open-source, and require no API key or account —
// so there's nothing to sign up for and nothing to pay. `env.osrmBaseUrl`
// defaults to OSRM's public demo server, which is fine for development and
// small projects; see the README for how to self-host one if you outgrow it.
const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";

// Nominatim's usage policy requires a descriptive User-Agent identifying
// the application (and asks for max ~1 request/second, which the caller
// in routeEngine.js respects by only ever geocoding two points per trip).
const NOMINATIM_HEADERS = {
  "User-Agent": "Vikas-smart-mobility-app/1.0 (educational project)",
  "Accept-Language": "en",
};

/** Forward-geocodes a place name to [lng, lat]. Biases results toward India. */
export async function geocode(query) {
  const { data } = await axios.get(`${NOMINATIM_BASE}/search`, {
    headers: NOMINATIM_HEADERS,
    params: {
      q: query,
      format: "jsonv2",
      limit: 1,
      countrycodes: "in",
    },
  });

  const result = data?.[0];
  if (!result) {
    const err = new Error(`Couldn't find a location matching "${query}".`);
    err.status = 404;
    throw err;
  }

  return {
    placeName: result.display_name,
    coordinates: [Number(result.lon), Number(result.lat)], // [lng, lat]
  };
}

/**
 * Fetches driving directions between two coordinates from OSRM, with
 * alternative routes where available so the frontend can offer a choice.
 */
export async function getDirections(fromCoords, toCoords, { alternatives = true } = {}) {
  const coordString = `${fromCoords.join(",")};${toCoords.join(",")}`;
  const url = `${env.osrmBaseUrl}/route/v1/driving/${coordString}`;

  const { data } = await axios.get(url, {
    params: {
      alternatives,
      geometries: "geojson",
      overview: "full",
      steps: false,
    },
  });

  if (data.code !== "Ok" || !data.routes?.length) {
    const err = new Error("OSRM couldn't find a driving route between those points.");
    err.status = 404;
    throw err;
  }

  return data.routes.map((r) => ({
    distanceKm: Math.round((r.distance / 1000) * 10) / 10,
    etaMins: Math.round(r.duration / 60),
    geometry: r.geometry, // GeoJSON LineString
  }));
}
