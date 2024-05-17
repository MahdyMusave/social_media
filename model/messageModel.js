const mongoose = require("mongoose");
const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
    default: new Date(),
  },
  updateAt: {
    type: Date,
    default: new Date(),
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  attachments: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "attachment",
  },
});
module.exports = mongoose.model("Message", messageSchema);
