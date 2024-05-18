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

//register
const createUser = async (req, res) => {
  // return console.log(req.body);

  const {
    firstName,
    lastName,
    username,
    gender,
    email,
    password,
    mobile,
    city,
    from,
  } = req.body;

  try {
    const createUser = await new User({
      firstName: firstName,
      lastName: lastName,
      username: username,
      gender: gender,
      email: email,
      password: password,
      mobile: mobile,
      from: from,
      city: city,
    });

    // return console.log(createUser);
    await createUser.save();

    res.status(200).json(createUser);
  } catch (error) {
    throw new Error(error);
  }
};
const updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const updateUser = await User.findByIdAndUpdate(id, {
      $set: req.body,
    });

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
//follow a user;
const following = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  // return console.log();
  try {
    if (id !== userId) {
      const user = await User.findById(id);
      // return console.log(user);

      if (!user.following.includes(userId)) {
        const addFollowing = await User.updateOne({
          $push: {
            following: userId,
          },
        });
        return res
          .status(200)
          .json({ addFollowing, msg: "followed with successfully" });
      } else {
        const unFollow = await User.updateOne({
          $pull: {
            following: userId,
          },
        });
        return res
          .status(200)
          .json({ unFollow, msg: "unFollow with successfully" });
      }
    }
    return res.status(401).json("you cant not follow your self");
  } catch (error) {
    throw new Error(error);
  }
};
const unFollow = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  // return console.log();
  try {
    if (id !== userId) {
      const user = await User.findById(id);
      // return console.log(user);
      if (user.following.includes(userId)) {
        const addFollowing = await User.updateOne({
          $pull: {
            following: userId,
          },
        });
        return res
          .status(200)
          .json({ addFollowing, msg: "unFollow with successfully" });
      }
    }
    return res.status(401).json("you cant not follow your self");
  } catch (error) {
    throw new Error(error);
  }
};
module.exports = {
  getAllUser,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  login,
  following,
  unFollow,
};
