import mongoose from "mongoose";

// One document per user, upserted on every position ping. TTL index clears
// out anyone who's gone quiet (app closed / crashed) after 5 minutes so
// "nearby vehicles" never shows a ghost.
const liveLocationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true }, // [lng, lat]
    },
    bearing: { type: Number, default: 0 },
    status: { type: String, enum: ["on-time", "running-late", "running-early"], default: "on-time" },
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", default: null },
    updatedAt: { type: Date, default: Date.now, expires: 300 }, // TTL: 5 minutes
  },
  { timestamps: { createdAt: false, updatedAt: true } }
);

liveLocationSchema.index({ location: "2dsphere" });

export default mongoose.model("LiveLocation", liveLocationSchema);
