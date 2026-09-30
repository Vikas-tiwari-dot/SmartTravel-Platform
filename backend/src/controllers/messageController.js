import asyncHandler from "express-async-handler";
import Message from "../models/Message.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { getIO } from "../sockets/index.js";

const QUICK_KIND_BY_TEXT = {
  "Give Way": "give-way",
  Emergency: "emergency",
  "Thanks!": "thanks",
  "Slowing down": "slow-down",
};

export const getConversation = asyncHandler(async (req, res) => {
  const { vehicleId } = req.params; // the other user's id

  const messages = await Message.find({
    $or: [
      { from: req.user._id, to: vehicleId },
      { from: vehicleId, to: req.user._id },
    ],
  }).sort({ createdAt: 1 });

  res.json(messages.map((m) => m.toPublicJSON(req.user._id)));
});

/**
 * Persists a message and pushes it over Socket.IO to the recipient in
 * real time, plus a Notification document so it shows up even if they're
 * offline. This is the REST fallback/history path — sockets/index.js
 * handles the live "typing now" path.
 */
export const sendMessage = asyncHandler(async (req, res) => {
  const { vehicleId, text } = req.body;

  if (String(vehicleId) === String(req.user._id)) {
    res.status(400);
    throw new Error("You can't message yourself.");
  }

  const recipient = await User.findById(vehicleId);
  if (!recipient) {
    res.status(404);
    throw new Error("That vehicle is no longer nearby.");
  }

  const message = await Message.create({
    from: req.user._id,
    to: vehicleId,
    text,
    kind: QUICK_KIND_BY_TEXT[text] || "custom",
  });

  if (message.kind === "give-way") {
    await User.findByIdAndUpdate(req.user._id, { $inc: { "stats.giveWaysSent": 1 } });
  }

  const notification = await Notification.create({
    user: vehicleId,
    type: "message",
    title: `${message.kind === "emergency" ? "🚨 Emergency" : "Message"} from ${req.user.name}`,
    body: text,
    meta: { fromUserId: req.user._id },
  });

  const io = getIO();
  io?.to(`user:${vehicleId}`).emit("message:new", message.toPublicJSON(vehicleId));
  io?.to(`user:${vehicleId}`).emit("notification:new", notification.toPublicJSON());

  res.status(201).json(message.toPublicJSON(req.user._id));
});
