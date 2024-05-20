import mongoose, { Schema } from "mongoose";

const friendRequestSchema = new mongoose.Schema(
  {
    requestTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    requestFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
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
const friendRequest = mongoose.model("friendRequest", friendRequestSchema);
export default friendRequest;
