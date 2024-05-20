import mongoose from "mongoose";
const presenceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  online: {
    type: Boolean,
    default: false,
  },
  lastSeen: {
    type: Date,
    default: Date.now,
  },
  updateAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Presence", presenceSchema);
