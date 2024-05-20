import mongoose, { Schema } from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    comment: {
      type: String,
      required: true,
    },
    from: { type: String, required: true },
    replies: [
      {
        rid: {
          type: mongoose.Schema.Types.ObjectId,
        },
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        from: { type: String },
        replyAt: { type: String },
        comment: { type: String },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
        likes: {
          type: Array,
          default: [],
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
const Comment = mongoose.model("comment", commentSchema);
export default Comment;
