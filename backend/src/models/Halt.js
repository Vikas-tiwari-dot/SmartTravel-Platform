import mongoose from "mongoose";

const haltSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    place: { type: String, required: true },
    type: { type: String, enum: ["tea", "dining", "hotel", "fuel", "restroom"], required: true },
    location: { type: String, default: "" },
    order: { type: String, default: "" },
    plannedMins: { type: Number, default: 10 },
    ivrConfirmed: { type: Boolean, default: false },
    ivrCallSid: { type: String, default: null }, // populated once a real IVR provider is wired in
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

haltSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this._id,
    place: this.place,
    type: this.type,
    location: this.location,
    order: this.order,
    plannedMins: this.plannedMins,
    ivrConfirmed: this.ivrConfirmed,
  };
};

export default mongoose.model("Halt", haltSchema);
