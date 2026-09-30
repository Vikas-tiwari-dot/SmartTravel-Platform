import asyncHandler from "express-async-handler";
import Event from "../models/Event.js";

export const listActiveEvents = asyncHandler(async (req, res) => {
  const { lng, lat, radiusMeters = 15000 } = req.query;

  const filter = { active: true };
  if (lng && lat) {
    filter.location = {
      $geoWithin: { $centerSphere: [[Number(lng), Number(lat)], Number(radiusMeters) / 6378100] },
    };
  }

  const events = await Event.find(filter).sort({ severity: -1, createdAt: -1 }).limit(50);
  res.json(events.map((e) => e.toPublicJSON()));
});

/** Lets any signed-in user flag a real-world disruption (crowdsourced, like the deck describes). */
export const reportEvent = asyncHandler(async (req, res) => {
  const { kind, title, detail, severity, etaImpactMins, lng, lat, radiusMeters } = req.body;

  const event = await Event.create({
    kind,
    title,
    detail,
    severity,
    etaImpactMins,
    location: { type: "Point", coordinates: [lng, lat] },
    radiusMeters: radiusMeters || 1500,
    reportedBy: req.user._id,
    expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000), // auto-expire after 4h
  });

  res.status(201).json(event.toPublicJSON());
});
