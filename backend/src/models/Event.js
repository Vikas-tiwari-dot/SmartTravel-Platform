import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    kind: { type: String, enum: ["exam", "rally", "crowd", "other"], required: true },
    title: { type: String, required: true },
    detail: { type: String, required: true },
    severity: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    etaImpactMins: { type: Number, default: 5 },

    // Where the disruption is centered, and how far its influence reaches.
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true }, // [lng, lat]
    },
    radiusMeters: { type: Number, default: 1500 },

    active: { type: Boolean, default: true },
    expiresAt: { type: Date },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

eventSchema.index({ location: "2dsphere" });

eventSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this._id,
    kind: this.kind,
    title: this.title,
    detail: this.detail,
    severity: this.severity,
    etaImpactMins: this.etaImpactMins,
    location: { lng: this.location.coordinates[0], lat: this.location.coordinates[1] },
    radiusMeters: this.radiusMeters,
    active: this.active,
  };
};

export default mongoose.model("Event", eventSchema);
