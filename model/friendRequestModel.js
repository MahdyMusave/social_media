import mongoose, { Schema } from "mongoose";

const friendRequestSchema = new mongoose.Schema(
  {
    requestTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    requestFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    requestStatus: {
      type: String,
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);
const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema);
export default FriendRequest;
