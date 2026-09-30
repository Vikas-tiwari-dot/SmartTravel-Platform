import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    to: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, maxlength: 500 },
    kind: { type: String, enum: ["give-way", "emergency", "thanks", "slow-down", "custom"], default: "custom" },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

messageSchema.index({ from: 1, to: 1, createdAt: 1 });

messageSchema.methods.toPublicJSON = function toPublicJSON(viewerId) {
  return {
    id: this._id,
    from: String(this.from) === String(viewerId) ? "me" : "them",
    text: this.text,
    kind: this.kind,
    time: this.createdAt.toLocaleTimeString?.("en-IN", { hour: "2-digit", minute: "2-digit" }) ?? this.createdAt,
  };
};

export default mongoose.model("Message", messageSchema);
