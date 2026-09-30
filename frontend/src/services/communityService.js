import { api } from "./api";

/**
 * Needs the caller's approximate location to find nearby ride-circle
 * listings; falls back to a Delhi default (Lajpat Nagar) if geolocation
 * isn't available or the user hasn't granted permission.
 */
async function getCurrentCoords() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve({ lng: 77.2432, lat: 28.5677 });
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lng: pos.coords.longitude, lat: pos.coords.latitude }),
      () => resolve({ lng: 77.2432, lat: 28.5677 }),
      { timeout: 4000 }
    );
  });
}

export async function getRideCircleMembers() {
  const { lng, lat } = await getCurrentCoords();
  const members = await api.get(`/ride-circle?lng=${lng}&lat=${lat}`);
  return members.map((m) => ({ ...m, id: m.id })); // backend already shapes this correctly
}

export async function getCommunityRequests() {
  return api.get("/ride-circle/community/requests");
}

export async function requestRideShare(memberId) {
  return api.post(`/ride-circle/${memberId}/request`);
}

export async function postCommunityRequest(text) {
  return api.post("/ride-circle/community/requests", { text });
}
