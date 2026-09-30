import asyncHandler from "express-async-handler";
import Halt from "../models/Halt.js";

export const listHalts = asyncHandler(async (req, res) => {
  const halts = await Halt.find({ user: req.user._id, completedAt: null }).sort({ createdAt: -1 });
  res.json(halts.map((h) => h.toPublicJSON()));
});

/**
 * Creates a halt and "places" the pre-order. A real deployment would call
 * out to a telephony provider (e.g. Twilio Voice) here and set ivrCallSid
 * from the response; that call is stubbed until a provider account is wired in.
 */
export const createHalt = asyncHandler(async (req, res) => {
  const { place, type, location, order } = req.body;

  const AVG_MINS = { tea: 8, dining: 35, hotel: 480, fuel: 12, restroom: 6 };

  const halt = await Halt.create({
    user: req.user._id,
    place,
    type,
    location,
    order,
    plannedMins: AVG_MINS[type] ?? 10,
    ivrConfirmed: false,
  });

  // Simulate the IVR provider confirming asynchronously, the way a real
  // callback webhook would land a few seconds after the call connects.
  setTimeout(async () => {
    await Halt.findByIdAndUpdate(halt._id, { ivrConfirmed: true });
  }, 4000);

  res.status(201).json(halt.toPublicJSON());
});

export const removeHalt = asyncHandler(async (req, res) => {
  const halt = await Halt.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!halt) {
    res.status(404);
    throw new Error("Halt not found.");
  }
  res.status(204).send();
});

export const completeHalt = asyncHandler(async (req, res) => {
  const halt = await Halt.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { completedAt: new Date() },
    { new: true }
  );
  if (!halt) {
    res.status(404);
    throw new Error("Halt not found.");
  }
  res.json(halt.toPublicJSON());
});
