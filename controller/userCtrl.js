import { User } from "../model/userModel.js";
import Verification from "../model/emailVerification.js";
import { compareString } from "../utils/index.js";

export const getAllUser = async (req, res) => {
  try {
    const allUser = await User.find({});
    res.json(allUser);
  } catch (err) {
    throw new Error(err);
  }
};

// export const getUser = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const oneUser = await User.findById({ _id: id });
//     res.json(oneUser);
//   } catch (err) {
//     throw new Error(err);
//   }
// };

export const updateUser = async (req, res) => {
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
export const deleteUser = async (req, res) => {
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

//follow a user;
export const following = async (req, res) => {
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
export const unFollow = async (req, res) => {
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

export const verifyEmail = async (req, res, next) => {
  const { userId, token } = req.params;
  try {
    const verification = await Verification.findOne({ userId });
    // return console.log(verification);
    if (verification) {
      const { expiresAt, token: hashedToken } = verification;
      // return console.log(token, hashedToken);
      if (expiresAt < Date.now()) {
        Verification.findOneAndDelete({ userId })
          .then(() => {
            User.findOneAndDelete({ _id: userId }).then(() => {
              const message = "Email time out successfully";
              // res.redirect(
              // `/api/users/verified?status=success&message=${message}`);

              res.redirect("/api/users/verified");
              return console.log("fail", message);
            });
          })
          .catch((err) => {
            console.log(err);
            const message = "verification failed or link is invalid";
            // res.redirect(`/api/users/verified?message=${message}`);
            res.redirect("/api/users/verified");
            return console.log(message);
          });
      } else {
        //vaild token
        // return console.log(token, hashToken);
        compareString(token, hashedToken)
          .then((isMatch) => {
            if (isMatch) {
              // return console.log(isMatch);
              User.findByIdAndUpdate(
                { _id: userId },
                {
                  verified: true,
                },
                {
                  new: true,
                }
              )
                .then(() => {
                  // return console.log(result);
                  Verification.findOneAndDelete({ userId }).then(() => {
                    const message = "Email verified successfully";
                    // res.redirect(
                    //   `/api/users/verified?status=success&message=${message}`
                    // );
                    res.redirect("/api/users/verified");
                    return console.log(message);
                  });
                })
                .catch((err) => {
                  console.log(err);
                  const message = "verification failed or link is invalid";
                  res.redirect("/api/users/verified");
                  return console.log(message);
                });
            } else {
              //invaild token
              const message = "Invalid verification link. try agin later";
              res.redirect("/api/users/verified");
              return console.log(message);
            }
          })
          .catch((err) => {
            console.log(err);
            res.redirect(`/api/users/verified?message=`);
          });
      }
    } else {
      const message = "Invalid verification link. try agin later";
      // res.redirect(`/api/users/verified?status=error&message=${message}`);
      res.redirect("/api/users/verified");
      return console.log(message);
    }
  } catch (error) {
    console.log(error),
      res.status(404).json({
        message: error.message,
      });
  }
};
// exports = {
//   getAllUser,
//   getUser,
//   createUser,
//   updateUser,
//   deleteUser,
//   login,
//   following,
//   unFollow,
// };
