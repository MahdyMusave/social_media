const User = require("../model/userModel");
const generateToken = require("../middleware/authMiddlerware");
const getAllUser = async (req, res) => {
  try {
    const allUser = await User.find({});
    res.json(allUser);
  } catch (err) {
    throw new Error(err);
  }
};

const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const oneUser = await User.findById({ _id: id });
    res.json(oneUser);
  } catch (err) {
    throw new Error(err);
  }
};
const createUser = async (req, res) => {
  // return console.log(req.body);

  const { firstName, lastName, email, password, mobile } = req.body;

  try {
    const createUser = await new User({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      mobile: mobile,
    });

    // return console.log(createUser);
    createUser.save();

    res.status(200).json(createUser);
  } catch (error) {
    throw new Error(error);
  }
};
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, password, mobile } = req.body;
  try {
    const updateUser = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          mobile: mobile,
        },
      },
      { new: true, runValidators: true }
    );

    res.json({
      updateUser,
      msg: "update with successfully",
    });
  } catch (err) {
    throw new Error(err);
  }
};
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteUser = await User.findByIdAndDelete(id);
    res.json({
      deleteUser,
      msg: "delete with successfully",
    });
  } catch (err) {
    throw new Error(err);
  }
};

const login = async (req, res) => {
  // console.log(req.body);
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json("Invalid  email");
    }
    // return console.log(user);
    if (user && (await user.checkPassword(password))) {
      // console.log(user);
      const refreshToken = generateToken(user);
      const updateUser = await User.findByIdAndUpdate(
        user._id,
        {
          refreshToken: refreshToken,
        },
        {
          new: true,
        }
      );

      res.cookie("refreshToken", refreshToken, {
        maxAge: 72 * 60 * 60 * 1000,
        httpOnly: true,
      });
      res.json({
        updateUser,
      });
    } else {
      return res.status(401).json("Invalid  email");
    }
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  getAllUser,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  login,
};
