import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "firstName is required"],
    },
    lastName: {
      type: String,
      required: [true, "firstName is required"],
    },
    username: {
      type: String,
      min: 5,
      max: 20,
      required: [true, "username is required"],
      unique: true,
    },
    email: {
      type: String,
      max: 50,
      required: [true, "email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [6, "password must be 6 character"],
      select: true,
    },
    gender: {
      type: String,
      required: true,
    },
    profileImg: {
      type: String,
      default: "",
    },
    coverImg: {
      type: String,
      default: "",
    },

    mobile: {
      type: Number,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },

    relationShip: {
      type: Number,
      enum: [1, 2, 3, 4],
    },
    location: { type: String },
    profileUrl: { type: String },
    profession: { type: String },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    views: [{ type: String }],
    verified: { type: Boolean, default: false },
    refreshToken: {
      token: String,
    },
  },

  {
    timestamps: true,
  }
);
userSchema.pre("save", async function (next) {
  // return console.log(this);
  if (!this.isModified("password")) {
    return next();
  }
  const saltRound = 10;
  const hashPassword = await bcrypt.hash(this.password, saltRound);
  this.password = hashPassword;
  next();
});

userSchema.methods.checkPassword = async function (password, callback) {
  // return console.log(this, password);
  return await bcrypt.compare(password, this.password);
};
//  return await bcrypt.compare(enteredPassword, this.password);

export const User = mongoose.model("User", userSchema);

//  module.exports = userModel;
