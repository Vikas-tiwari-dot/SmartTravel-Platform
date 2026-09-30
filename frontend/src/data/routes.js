// Mock data standing in for the "Data Collection" layer described in the deck:
// real-time traffic + user input + public events feed the routing engine.

export const marketInsights = [
  { id: "mi1", stat: "30–40%", label: "longer travel time in metro cities from congestion" },
  { id: "mi2", stat: "7", label: "disruption types TripLink watches for, from rallies to exam-day crowds" },
  { id: "mi3", stat: "0", label: "coordination between commuters on today's standard GPS apps" },
];

export const detectedEvents = [
  {
    id: "ev1",
    kind: "exam",
    title: "Board exam center — DPS Mathura Road",
    detail: "Heavy pedestrian crossing 7:45–9:15 AM, expect 12–15 min added delay.",
    severity: "medium",
    etaImpactMins: 14,
  },
  {
    id: "ev2",
    kind: "rally",
    title: "Public rally — India Gate lawns",
    detail: "Road closures reported on C-Hexagon approach roads until 6 PM.",
    severity: "high",
    etaImpactMins: 26,
  },
  {
    id: "ev3",
    kind: "crowd",
    title: "Sudden crowd surge — Nehru Place market",
    detail: "Weekend footfall spike detected from live sensor + user reports.",
    severity: "low",
    etaImpactMins: 6,
  },
];

export const routeOptions = [
  {
    id: "r1",
    label: "Smart Route",
    roadType: "NH",
    recommended: true,
    distanceKm: 18.4,
    etaMins: 42,
    delayMins: 4,
    crowdLevel: "moderate",
    notes: "Reroutes around the India Gate rally automatically.",
    waypoints: ["Lajpat Nagar", "Ashram Chowk", "Sarai Kale Khan", "Akshardham"],
  },
  {
    id: "r2",
    label: "Standard GPS Route",
    roadType: "SH",
    recommended: false,
    distanceKm: 15.9,
    etaMins: 61,
    delayMins: 26,
    crowdLevel: "heavy",
    notes: "Runs straight through the rally zone — static routing only.",
    waypoints: ["Lajpat Nagar", "India Gate", "ITO", "Akshardham"],
  },
  {
    id: "r3",
    label: "Scenic / Low-traffic",
    roadType: "City",
    recommended: false,
    distanceKm: 21.2,
    etaMins: 48,
    delayMins: 8,
    crowdLevel: "light",
    notes: "Longer distance, but avoids both the exam center and the rally.",
    waypoints: ["Lajpat Nagar", "Kalkaji", "Okhla", "Akshardham"],
  },
];

export const recentTrips = [
  { id: "t1", from: "Lajpat Nagar", to: "Akshardham Metro", date: "Aug 12", savedMins: 22 },
  { id: "t2", from: "Karol Bagh", to: "Cyber Hub, Gurugram", date: "Aug 9", savedMins: 15 },
  { id: "t3", from: "Rohini Sector 7", to: "Connaught Place", date: "Aug 6", savedMins: 9 },
];
