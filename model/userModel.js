const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      min: 5,
      max: 20,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      max: 50,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
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
    followers: {
      type: Array,
      default: [],
    },
    following: {
      type: Array,
      default: [],
    },
    mobile: {
      type: Number,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    description: {
      type: String,
    },
    city: {
      type: String,
      max: 50,
    },
    from: {
      type: String,
      max: 50,
    },
    relationShip: {
      type: Number,
      enum: [1, 2, 3, 4],
    },
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

module.exports = mongoose.model("User", userSchema);

//  module.exports = userModel;
