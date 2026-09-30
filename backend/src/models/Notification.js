import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["event", "message", "halt", "ride", "system"], required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    unread: { type: Boolean, default: true },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} }, // e.g. { messageFromUserId, tripId }
  },
  { timestamps: true }
);

notificationSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this._id,
    type: this.type,
    title: this.title,
    body: this.body,
    unread: this.unread,
    time: this.createdAt,
  };
};

export default mongoose.model("Notification", notificationSchema);
