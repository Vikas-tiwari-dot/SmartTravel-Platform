import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";
import Event from "../models/Event.js";
import CommunityRequest from "../models/CommunityRequest.js";
import { RideCircleEntry } from "../models/RideCircle.js";

// Real Delhi-area coordinates so OSRM routing + event-radius checks have
// something meaningful to work with out of the box.
const EVENTS = [
  {
    kind: "exam",
    title: "Board exam center — DPS Mathura Road",
    detail: "Heavy pedestrian crossing 7:45–9:15 AM, expect 12–15 min added delay.",
    severity: "medium",
    etaImpactMins: 14,
    location: { type: "Point", coordinates: [77.2410, 28.5730] },
    radiusMeters: 1200,
  },
  {
    kind: "rally",
    title: "Public rally — India Gate lawns",
    detail: "Road closures reported on C-Hexagon approach roads until 6 PM.",
    severity: "high",
    etaImpactMins: 26,
    location: { type: "Point", coordinates: [77.2295, 28.6129] },
    radiusMeters: 2000,
  },
  {
    kind: "crowd",
    title: "Sudden crowd surge — Nehru Place market",
    detail: "Weekend footfall spike detected from live sensor + user reports.",
    severity: "low",
    etaImpactMins: 6,
    location: { type: "Point", coordinates: [77.2500, 28.5490] },
    radiusMeters: 900,
  },
];

async function seed() {
  await connectDB();

  console.log("[seed] clearing existing demo data...");
  await Promise.all([
    Event.deleteMany({}),
    CommunityRequest.deleteMany({}),
    RideCircleEntry.deleteMany({}),
  ]);

  let demoUser = await User.findOne({ email: "demo@TripLink.app" });
  if (!demoUser) {
    demoUser = await User.create({
      name: "TripLink",
      email: "demo@TripLink.app",
      passwordHash: await User.hashPassword("demopass123"),
      handle: "@ananya.r",
      homeCity: "New Delhi",
      avatarColor: "#0e7c86",
      vehicle: { nickname: "Daily Ride", type: "scooter", registration: "DL 4S AB 4471", label: "Honda Activa 6G · DL 4S AB 4471" },
      stats: { tripsPlanned: 128, hoursSaved: 34, fuelSavedLitres: 41, giveWaysSent: 19 },
    });
    console.log("[seed] created demo user: demo@TripLink.app / demopass123");
  }

  let secondUser = await User.findOne({ email: "rohit@TripLink.app" });
  if (!secondUser) {
    secondUser = await User.create({
      name: "Rohit Malhotra",
      email: "rohit@TripLink.app",
      passwordHash: await User.hashPassword("demopass123"),
      handle: "@rohit.m",
      homeCity: "New Delhi",
      avatarColor: "#f2a900",
      vehicle: { nickname: "Commuter Car", type: "car", registration: "DL 3C XY 8821", label: "Swift Dzire · DL 3C XY 8821" },
    });
  }

  await Event.insertMany(EVENTS);
  console.log(`[seed] inserted ${EVENTS.length} active events`);

  await CommunityRequest.insertMany([
    { user: secondUser._id, text: "Anyone near Sarai Kale Khan headed to Akshardham after 6? Bike pillion works too." },
    { user: demoUser._id, text: "Sharing an auto from Ashram Chowk in 20 mins if 2 more want in." },
  ]);

  await RideCircleEntry.create({
    user: secondUser._id,
    routeLabel: "Lajpat Nagar → Akshardham",
    fromCoords: { lng: 77.2432, lat: 28.5677 },
    toCoords: { lng: 77.2773, lat: 28.6127 },
    departureWindowStart: "18:00",
    departureWindowEnd: "18:20",
    seatsOffered: 1,
    rating: 4.8,
  });

  console.log("[seed] done.");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("[seed] failed:", err);
  process.exit(1);
});
