import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    handle: { type: String, trim: true },
    homeCity: { type: String, default: "New Delhi" },
    avatarColor: { type: String, default: "#0e7c86" },

    vehicle: {
      nickname: { type: String, default: "Daily Ride" },
      type: { type: String, enum: ["car", "scooter", "auto", "bus"], default: "scooter" },
      registration: { type: String, default: "" },
      label: { type: String, default: "" }, // e.g. "Honda Activa 6G · DL 4S AB 4471"
    },

    privacy: {
      shareLocationOnActiveTrip: { type: Boolean, default: true },
      encryptMessages: { type: Boolean, default: true },
    },

    stats: {
      tripsPlanned: { type: Number, default: 0 },
      hoursSaved: { type: Number, default: 0 },
      fuelSavedLitres: { type: Number, default: 0 },
      giveWaysSent: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.passwordHash);
};

userSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    handle: this.handle || `@${this.name.split(" ")[0].toLowerCase()}`,
    homeCity: this.homeCity,
    avatarColor: this.avatarColor,
    vehicle: this.vehicle,
    privacy: this.privacy,
    stats: this.stats,
    memberSince: this.createdAt?.getFullYear?.().toString(),
  };
};

userSchema.statics.hashPassword = function hashPassword(plain) {
  return bcrypt.hash(plain, 10);
};

export default mongoose.model("User", userSchema);
