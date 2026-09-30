import mongoose from "mongoose";

const communityRequestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, maxlength: 280 },
  },
  { timestamps: true }
);

export default mongoose.model("CommunityRequest", communityRequestSchema);
