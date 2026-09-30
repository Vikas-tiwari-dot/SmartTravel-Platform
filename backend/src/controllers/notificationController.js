import asyncHandler from "express-async-handler";
import Notification from "../models/Notification.js";

export const listNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50);
  res.json(notifications.map((n) => n.toPublicJSON()));
});

export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { unread: false },
    { new: true }
  );
  if (!notification) {
    res.status(404);
    throw new Error("Notification not found.");
  }
  res.json(notification.toPublicJSON());
});

export const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ user: req.user._id, unread: true }, { unread: false });
  const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50);
  res.json(notifications.map((n) => n.toPublicJSON()));
});
