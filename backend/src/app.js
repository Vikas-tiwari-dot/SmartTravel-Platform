import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import { env, isProd } from "./config/env.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import tripRoutes from "./routes/tripRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import haltRoutes from "./routes/haltRoutes.js";
import rideCircleRoutes from "./routes/rideCircleRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: env.clientOrigin, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(morgan(isProd ? "combined" : "dev"));

// Generous but present — protects the free OSRM/Nominatim usage and login from abuse.
app.use(
  "/api",
  rateLimit({ windowMs: 15 * 60 * 1000, max: 300, standardHeaders: true, legacyHeaders: false })
);

app.get("/api/health", (req, res) => res.json({ ok: true, service: "TripLink-backend" }));

app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/halts", haltRoutes);
app.use("/api/ride-circle", rideCircleRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/users", userRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
