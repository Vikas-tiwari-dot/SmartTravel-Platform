import { api } from "./api";

// Static reference data — matches the backend's AVG_MINS table in
// haltController.js, used only to populate the "type" dropdown client-side.
const HALT_TYPES = [
  { id: "tea", label: "Tea stall", avgMins: 8, icon: "coffee" },
  { id: "dining", label: "Dining", avgMins: 35, icon: "utensils" },
  { id: "hotel", label: "Hotel stay", avgMins: 480, icon: "bed" },
  { id: "fuel", label: "Fuel / EV charge", avgMins: 12, icon: "fuel" },
  { id: "restroom", label: "Restroom", avgMins: 6, icon: "droplets" },
];

export async function getHalts() {
  return api.get("/halts");
}

export function getHaltTypes() {
  return HALT_TYPES;
}

export async function createHalt(halt) {
  return api.post("/halts", halt);
}

export async function removeHalt(id) {
  await api.delete(`/halts/${id}`);
  return true;
}
