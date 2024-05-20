import mongoose, { Schema } from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    description: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    likes: {
      type: Array,
      default: [],
    },
    images: [
      {
        type: String,
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comments",
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);
const Post = mongoose.model("Post", postSchema);
export default Post;
