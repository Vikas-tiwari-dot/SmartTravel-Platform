import asyncHandler from "express-async-handler";
import Trip from "../models/Trip.js";
import User from "../models/User.js";
import { planTrip } from "../services/routeEngine.js";

export const createTripPlan = asyncHandler(async (req, res) => {
  const { from, to, arrivalTime, halts } = req.body;

  const plan = await planTrip({ from, to, halts });

  const trip = await Trip.create({
    user: req.user._id,
    from: plan.from,
    to: plan.to,
    fromCoords: plan.fromCoords,
    toCoords: plan.toCoords,
    arrivalTime: arrivalTime || null,
    halts: plan.halts,
    routes: plan.routes,
  });

  await User.findByIdAndUpdate(req.user._id, { $inc: { "stats.tripsPlanned": 1 } });

  res.status(201).json({
    tripId: trip._id,
    from: plan.from,
    to: plan.to,
    arrivalTime: trip.arrivalTime,
    halts: plan.halts,
    events: plan.events,
    routes: plan.routes,
  });
});

export const getRecentTrips = asyncHandler(async (req, res) => {
  const trips = await Trip.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(10);
  res.json(trips.map((t) => t.toPublicJSON()));
});

export const startTrip = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { routeLabel } = req.body;

  const trip = await Trip.findOne({ _id: id, user: req.user._id });
  if (!trip) {
    res.status(404);
    throw new Error("Trip not found.");
  }

  trip.status = "active";
  trip.selectedRouteLabel = routeLabel || trip.routes[0]?.label || null;
  await trip.save();

  res.json(trip.toPublicJSON());
});

export const completeTrip = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { savedMins = 0 } = req.body;

  const trip = await Trip.findOneAndUpdate(
    { _id: id, user: req.user._id },
    { status: "completed", savedMins },
    { new: true }
  );
  if (!trip) {
    res.status(404);
    throw new Error("Trip not found.");
  }

  await User.findByIdAndUpdate(req.user._id, {
    $inc: { "stats.hoursSaved": Math.round((savedMins / 60) * 10) / 10 },
  });

  res.json(trip.toPublicJSON());
});
