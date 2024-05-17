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
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobile: {
      type: Number,
      required: true,
    },
    role: {
      type: String,
      default: "user",
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
