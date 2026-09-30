import mongoose from "mongoose";

const routeOptionSchema = new mongoose.Schema(
  {
    id: String,
    label: String,
    roadType: { type: String, enum: ["NH", "SH", "City"], default: "City" },
    recommended: { type: Boolean, default: false },
    distanceKm: Number,
    etaMins: Number,
    delayMins: { type: Number, default: 0 },
    crowdLevel: { type: String, enum: ["light", "moderate", "heavy"], default: "moderate" },
    notes: String,
    waypoints: [String],
    geometry: mongoose.Schema.Types.Mixed, // GeoJSON LineString from OSRM Directions
  },
  { _id: false }
);

const tripSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    fromCoords: { lng: Number, lat: Number },
    toCoords: { lng: Number, lat: Number },
    arrivalTime: { type: String, default: null },
    halts: [{ type: String }],

    events: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
    routes: [routeOptionSchema],
    selectedRouteLabel: { type: String, default: null },

    status: { type: String, enum: ["planned", "active", "completed", "cancelled"], default: "planned" },
    savedMins: { type: Number, default: 0 },
  },
  { timestamps: true }
);

tripSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this._id,
    from: this.from,
    to: this.to,
    arrivalTime: this.arrivalTime,
    halts: this.halts,
    routes: this.routes,
    status: this.status,
    savedMins: this.savedMins,
    date: this.createdAt,
  };
};

export default mongoose.model("Trip", tripSchema);
