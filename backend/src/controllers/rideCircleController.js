import asyncHandler from "express-async-handler";
import { RideCircleEntry, RideRequest } from "../models/RideCircle.js";
import CommunityRequest from "../models/CommunityRequest.js";
import Notification from "../models/Notification.js";
import { haversineMeters } from "../utils/geo.js";
import { getIO } from "../sockets/index.js";

/**
 * Finds active ride-circle entries whose start point is within `radiusMeters`
 * of the caller's start point — a simple proxy for "shares part of your route."
 */
export const listNearbyEntries = asyncHandler(async (req, res) => {
  const { lng, lat, radiusMeters = 3000 } = req.query;

  const entries = await RideCircleEntry.find({ active: true, user: { $ne: req.user._id } })
    .populate("user", "name avatarColor vehicle")
    .sort({ createdAt: -1 })
    .limit(30);

  const filtered = lng && lat
    ? entries.filter((e) => {
        if (!e.fromCoords?.lng) return true;
        const d = haversineMeters([Number(lng), Number(lat)], [e.fromCoords.lng, e.fromCoords.lat]);
        return d <= Number(radiusMeters);
      })
    : entries;

  res.json(
    filtered.map((e) => ({
      id: e._id,
      name: e.user.name,
      vehicle: e.user.vehicle?.type === "scooter" ? "Scooter" : "Car",
      route: e.routeLabel,
      overlapKm: e.fromCoords && e.toCoords
        ? Math.round((haversineMeters([e.fromCoords.lng, e.fromCoords.lat], [e.toCoords.lng, e.toCoords.lat]) / 1000) * 10) / 10
        : null,
      departureWindow: `${e.departureWindowStart} – ${e.departureWindowEnd}`,
      seatsOffered: e.seatsOffered,
      rating: e.rating,
    }))
  );
});

export const createEntry = asyncHandler(async (req, res) => {
  const { routeLabel, fromCoords, toCoords, departureWindowStart, departureWindowEnd, seatsOffered } = req.body;

  const entry = await RideCircleEntry.create({
    user: req.user._id,
    routeLabel,
    fromCoords,
    toCoords,
    departureWindowStart,
    departureWindowEnd,
    seatsOffered,
  });

  res.status(201).json(entry);
});

export const requestRide = asyncHandler(async (req, res) => {
  const { id } = req.params; // ride circle entry id

  const entry = await RideCircleEntry.findById(id);
  if (!entry) {
    res.status(404);
    throw new Error("That ride-circle listing is no longer available.");
  }

  const request = await RideRequest.create({ fromUser: req.user._id, toEntry: id });

  const notification = await Notification.create({
    user: entry.user,
    type: "ride",
    title: `${req.user.name} wants to share your ride`,
    body: `Requesting a seat on ${entry.routeLabel}, departing ${entry.departureWindowStart}.`,
    meta: { requestId: request._id },
  });

  getIO()?.to(`user:${entry.user}`).emit("notification:new", notification.toPublicJSON());

  res.status(201).json({ id: request._id, status: request.status });
});

export const listCommunityRequests = asyncHandler(async (req, res) => {
  const requests = await CommunityRequest.find().populate("user", "name").sort({ createdAt: -1 }).limit(20);
  res.json(
    requests.map((r) => ({
      id: r._id,
      name: r.user.name,
      text: r.text,
      time: r.createdAt,
    }))
  );
});

export const createCommunityRequest = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const request = await CommunityRequest.create({ user: req.user._id, text });
  const populated = await request.populate("user", "name");
  res.status(201).json({ id: populated._id, name: populated.user.name, text: populated.text, time: populated.createdAt });
});
