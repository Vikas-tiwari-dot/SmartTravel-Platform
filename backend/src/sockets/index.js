import { Server } from "socket.io";
import { verifyToken } from "../middleware/auth.js";
import User from "../models/User.js";
import Message from "../models/Message.js";
import Notification from "../models/Notification.js";
import LiveLocation from "../models/LiveLocation.js";
import { env } from "../config/env.js";

let io = null;

export function getIO() {
  return io;
}

export function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: { origin: env.clientOrigin, credentials: true },
  });

  // Every socket must present a valid JWT — same token the REST API uses —
  // either via the `auth.token` handshake field or a `token` cookie.
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers.cookie
          ?.split("; ")
          .find((c) => c.startsWith("token="))
          ?.split("=")[1];

      if (!token) return next(new Error("Missing auth token"));

      const payload = verifyToken(token);
      const user = await User.findById(payload.sub);
      if (!user) return next(new Error("User not found"));

      socket.userId = String(user._id);
      socket.userName = user.name;
      next();
    } catch {
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    const room = `user:${socket.userId}`;
    socket.join(room);
    console.log(`[socket] ${socket.userName} connected (${socket.id})`);

    // --- Live position broadcast -------------------------------------
    // Client pings this on an interval (e.g. every 3-5s) while a trip is
    // active. We upsert to Mongo (source of truth for REST "nearby" polling)
    // and also fan the update out live to anyone in range who's subscribed.
    socket.on("position:update", async ({ lng, lat, bearing = 0, status = "on-time", tripId = null }) => {
      if (typeof lng !== "number" || typeof lat !== "number") return;

      await LiveLocation.findOneAndUpdate(
        { user: socket.userId },
        { location: { type: "Point", coordinates: [lng, lat] }, bearing, status, tripId, updatedAt: new Date() },
        { upsert: true }
      );

      socket.broadcast.emit("vehicle:moved", {
        id: socket.userId,
        lng,
        lat,
        bearing,
        status,
      });
    });

    // --- Direct messaging ----------------------------------------------
    // Mirrors POST /api/messages so a connected client gets instant delivery
    // without waiting on a REST round trip; the REST route remains the
    // source of truth / history for anyone not currently connected.
    socket.on("message:send", async ({ vehicleId, text, kind = "custom" }, ack) => {
      try {
        if (!vehicleId || !text?.trim()) throw new Error("vehicleId and text are required");

        const message = await Message.create({ from: socket.userId, to: vehicleId, text, kind });

        const notification = await Notification.create({
          user: vehicleId,
          type: "message",
          title: `${kind === "emergency" ? "🚨 Emergency" : "Message"} from ${socket.userName}`,
          body: text,
          meta: { fromUserId: socket.userId },
        });

        const payloadForRecipient = message.toPublicJSON(vehicleId);
        io.to(`user:${vehicleId}`).emit("message:new", payloadForRecipient);
        io.to(`user:${vehicleId}`).emit("notification:new", notification.toPublicJSON());

        ack?.({ ok: true, message: message.toPublicJSON(socket.userId) });
      } catch (err) {
        ack?.({ ok: false, error: err.message });
      }
    });

    socket.on("disconnect", () => {
      console.log(`[socket] ${socket.userName} disconnected (${socket.id})`);
    });
  });

  return io;
}
