import mongoose from "mongoose";

const rideCircleEntrySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    routeLabel: { type: String, required: true }, // e.g. "Lajpat Nagar → Akshardham"
    fromCoords: { lng: Number, lat: Number },
    toCoords: { lng: Number, lat: Number },
    departureWindowStart: { type: String, required: true }, // "18:00"
    departureWindowEnd: { type: String, required: true },
    seatsOffered: { type: Number, default: 0 },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const rideRequestSchema = new mongoose.Schema(
  {
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    toEntry: { type: mongoose.Schema.Types.ObjectId, ref: "RideCircleEntry", required: true },
    status: { type: String, enum: ["pending", "accepted", "declined"], default: "pending" },
  },
  { timestamps: true }
);

export const RideCircleEntry = mongoose.model("RideCircleEntry", rideCircleEntrySchema);
export const RideRequest = mongoose.model("RideRequest", rideRequestSchema);
