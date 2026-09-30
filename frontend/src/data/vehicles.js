// Backing data for the "Vehicle Interaction Layer" — nearby vehicles rendered
// as tappable icons on the live map, per the Architecture / Flow Diagram slide.

export const nearbyVehicles = [
  {
    id: "v1",
    label: "Swift Dzire · DL 3C XY 8821",
    type: "car",
    x: 32,
    y: 40,
    bearing: 45,
    distanceM: 28,
    status: "running-late",
  },
  {
    id: "v2",
    label: "Activa 5G · DL 9S QW 1120",
    type: "scooter",
    x: 58,
    y: 22,
    bearing: 120,
    distanceM: 64,
    status: "on-time",
  },
  {
    id: "v3",
    label: "Auto Rickshaw · DL 1RTB 7743",
    type: "auto",
    x: 71,
    y: 58,
    bearing: 200,
    distanceM: 91,
    status: "running-early",
  },
  {
    id: "v4",
    label: "City Bus 764 · DTC",
    type: "bus",
    x: 18,
    y: 68,
    bearing: 300,
    distanceM: 140,
    status: "on-time",
  },
  {
    id: "v5",
    label: "Bolt Pro N · DL 5C KJ 4402",
    type: "car",
    x: 47,
    y: 78,
    bearing: 15,
    distanceM: 52,
    status: "running-late",
  },
];

export const quickMessages = [
  { id: "give-way", label: "Give Way", tone: "amber" },
  { id: "emergency", label: "Emergency", tone: "red" },
  { id: "thanks", label: "Thanks!", tone: "teal" },
  { id: "slow-down", label: "Slowing down", tone: "ink" },
];

export const conversationSeed = {
  v1: [
    { id: "m1", from: "them", text: "Running 6 min late, can I merge ahead at the signal?", time: "5:42 PM" },
    { id: "m2", from: "me", text: "Give Way sent — go ahead 🙂", time: "5:42 PM" },
  ],
  v3: [
    { id: "m1", from: "them", text: "I'm early, happy to hold the gap if you need it.", time: "5:38 PM" },
  ],
};
