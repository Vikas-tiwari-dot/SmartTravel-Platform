import asyncHandler from "express-async-handler";
import User from "../models/User.js";

export const getProfile = asyncHandler(async (req, res) => {
  res.json({ user: req.user.toPublicJSON() });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, homeCity, vehicle, privacy } = req.body;

  if (name) req.user.name = name;
  if (homeCity) req.user.homeCity = homeCity;
  if (vehicle) req.user.vehicle = { ...req.user.vehicle.toObject(), ...vehicle };
  if (privacy) req.user.privacy = { ...req.user.privacy.toObject(), ...privacy };

  await req.user.save();
  res.json({ user: req.user.toPublicJSON() });
});
