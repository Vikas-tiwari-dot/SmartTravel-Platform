import asyncHandler from "express-async-handler";
import LiveLocation from "../models/LiveLocation.js";
import User from "../models/User.js";

/** Upserts the caller's live position. Also called from the socket layer on every ping. */
export const updatePosition = asyncHandler(async (req, res) => {
  const { lng, lat, bearing = 0, status = "on-time", tripId = null } = req.body;

  const doc = await LiveLocation.findOneAndUpdate(
    { user: req.user._id },
    {
      location: { type: "Point", coordinates: [lng, lat] },
      bearing,
      status,
      tripId,
      updatedAt: new Date(),
    },
    { upsert: true, new: true }
  );

  res.json({ ok: true, updatedAt: doc.updatedAt });
});

export const clearPosition = asyncHandler(async (req, res) => {
  await LiveLocation.deleteOne({ user: req.user._id });
  res.status(204).send();
});

/** Vehicles within `radiusMeters` of the given point, excluding the caller. */
export const getNearbyVehicles = asyncHandler(async (req, res) => {
  const { lng, lat, radiusMeters = 500 } = req.query;
  if (!lng || !lat) {
    res.status(400);
    throw new Error("lng and lat query params are required.");
  }

  const nearby = await LiveLocation.find({
    user: { $ne: req.user._id },
    location: {
      $near: {
        $geometry: { type: "Point", coordinates: [Number(lng), Number(lat)] },
        $maxDistance: Number(radiusMeters),
      },
    },
  })
    .populate("user", "name vehicle avatarColor")
    .limit(30);

  const [callerLng, callerLat] = [Number(lng), Number(lat)];
  const vehicles = nearby.map((loc) => {
    const [vLng, vLat] = loc.location.coordinates;
    return {
      id: loc.user._id,
      label: loc.user.vehicle?.label || `${loc.user.vehicle?.nickname || "Vehicle"}`,
      type: loc.user.vehicle?.type || "car",
      lng: vLng,
      lat: vLat,
      bearing: loc.bearing,
      distanceM: Math.round(haversine(callerLng, callerLat, vLng, vLat)),
      status: loc.status,
    };
  });

  res.json(vehicles);
});

function haversine(lng1, lat1, lng2, lat2) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
