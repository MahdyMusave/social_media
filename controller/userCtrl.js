import { User } from "../model/userModel.js";
import Verification from "../model/emailVerification.js";
import { compareString, createToken, hashString } from "../utils/index.js";
import PasswordReset from "../model/passwordResetModel.js";
import { resetPasswordLink } from "../utils/sendEmail.js";
import { generateToken } from "../middleware/authMiddlerware.js";
import FriendRequest from "../model/friendRequestModel.js";

export const getAllUser = async (req, res) => {
  try {
    const allUser = await User.find({});
    res.json(allUser);
  } catch (err) {
    throw new Error(err);
  }
};

export const getUser = async (req, res, next) => {
  const userId = req.user._id;
  const { id } = req.params;
  // return console.log(_id);
  try {
    const oneUser = await User.findById(userId && id).populate({
      path: "friends",
      select: "-password",
    });
    if (!oneUser) {
      res.status(500).json({
        message: "user Not found",
        success: false,
      });
    }
    res.status(200).json({
      success: true,
      data: oneUser,
    });
  } catch (err) {
    // throw new Error(err);
    res.status(500).json({
      message: "auth error",
      success: false,
      error: err.message,
    });
  }
};

export const updateUser = async (req, res, next) => {
  const userId = req.user._id;
  const { id } = req.params;
  // return console.log(userId, id);

  try {
    const { firstName, lastName, location, profileUrl, profession } = req.body;
    if (!(firstName, lastName, location, profileUrl, profession)) {
      next("Please provide all required fields");
      return;
    }

    const updateUserData = {
      firstName,
      lastName,
      location,
      profileUrl,
      profession,
      _id: userId,
    };
    // return console.log(updateUserData);

    const updateUser = await User.findByIdAndUpdate(id, updateUserData, {
      new: true,
    });
    await updateUser.populate({
      path: "friends",
      select: "-password",
    });
    const token = generateToken(updateUser?._id, updateUser?.firstName);
    updateUser.password = undefined;
    res.status(200).json({
      success: true,
      message: "user update with successfully",
      updateUser,
      token,
    });
  } catch (err) {
    res.status(500).json({
      message: "update error",
      success: false,
    });
    // throw new Error(err);
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
            User.findOneAndDelete({ _id: userId })
              .then(() => {
                const message = "Verification token has expired.";
                // return console.log("fail", message);

                return res.redirect(
                  `/api/users/verified?status=error&message=${message}`
                );
              })
              .catch((err) => {
                console.log(err);
                const message = "verification failed or link is invalid";

                // res.redirect(`/users/verified?status=error&message=`);
                return console.log(message);
              });
          })
          .catch((err) => {
            console.log(err);
            const message = "verification failed or link is invalid";
            // res.redirect(`/api/users/verified?message=${message}`);
            // res.redirect("/api/users/verified");
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
                    // console.log(message);
                    return res.redirect(
                      `/api/users/verified?status=success&message=${message}`
                    );
                    // res.redirect("/api/users/verified");
                  });
                })
                .catch((err) => {
                  console.log(err);
                  const message = "verification failed or link is invalid";
                  // res.redirect("/api/users/verified");
                  return console.log(message);
                });
            } else {
              //invaild token
              const message = "Invalid verification link. 1 try agin later";
              // res.redirect("/api/users/verified");
              // return console.log(message);
              return res.redirect(
                `/api/users/verified?status=error&message=${message}`
              );
            }
          })
          .catch((err) => {
            // return console.log(err, "ggg");
            return res.redirect(`/api/users/verified?message=`);
          });
      }
    } else {
      const message = "Invalid verification link. 3 try agin later";
      //  return console.log(message);
      return res.redirect(
        `/api/users/verified?status=error&message=${message}`
      );
      // res.redirect("/api/users/verified");
    }
  } catch (error) {
    console.log(error),
      res.status(404).json({
        message: error.message,
      });
  }
};
// request reset password
export const requestPasswordReset = async (req, res, next) => {
  // return console.log(req.body);
  try {
    const { email } = req.body;
    const user = await User.findOne({
      email,
    });
    if (!user) {
      // next("email address not found");
      // return;
      return res.status(404).json({
        message: "email address not found",
        success: false,
      });
    }

    const existingRequest = await PasswordReset.findOne({ email });
    if (existingRequest) {
      if (existingRequest.expiresAt > Date.now()) {
        return res.status(201).json({
          status: "PENDING",
          message: "Reset password link has  already  been sent to your email ",
        });
      }
      await PasswordReset.findOneAndDelete({
        email,
      });
    }
    await resetPasswordLink(user);
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      message: error.message,
      success: false,
    });
  }
};
export const verifyPassword = async (req, res) => {
  const { userId, token } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      const message = "invalid password and password reset .please try agin";
      return res.redirect(
        `/api/users/verifiedPassword?status=error&message=${message}`
      );
    }

    const resetPassword = await PasswordReset.findOne({ userId });
    if (!resetPassword) {
      const message = "invalid password reset 1.please try agin";
      return res.redirect(
        `/api/users/verifiedPassword?status=error&message=${message}`
      );
    }
    // return console.log(user);
    const { expiresAt, token: hashedToken } = resetPassword;
    if (expiresAt < Date.now()) {
      const message = "Rest Password link has expired.please try agin";
      return res.redirect(
        `/api/users/verifiedPassword?status=error&message=${message}`
      );
    } else {
      // return console.log(token, hashedToken);
      const isMatch = await compareString(token, hashedToken);
      // return console.log(isMatch);
      if (!isMatch) {
        const message = "Invalid reset password link .please try agin";
        res.redirect(
          `/api/users/verifiedPassword?status=error&message=${message}`
        );
      } else {
        res.redirect(`/api/users/verifiedPassword?type=reset&userId=${userId}`);
      }
    }

    return console.log(resetPassword);
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    });
  }
  // return res.redirect("/api/users/verifiedPassword");
};
export const changePasswordReset = async (req, res) => {
  // return console.log(req.body);
  try {
    const { userId, password, repeatPassword } = req.body;
    const hashedPassword = await hashString(password);
    const user = await User.findByIdAndUpdate(
      userId,
      {
        password: hashedPassword,
      },
      {
        new: true,
      }
    );

    if (user) {
      await PasswordReset.findOneAndDelete({ userId });
      const message = "password successfully reset";
      return res.redirect(
        `/api/users/verifiedPassword?status=success&message=${message}`
      );
    }
  } catch (error) {
    console.log(error);
    res.status(402).json({ message: error.message });
  }
};

export const sendFriendRequest = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { requestTo } = req.body;

    const requestExist = await FriendRequest.findOne({
      requestFrom: _id,
      requestTo,
    });

    if (requestExist) {
      next("Friend Request already sent.");
      return;
    }

    const accountExist = await FriendRequest.findOne({
      requestFrom: requestTo,
      requestTo: _id,
    });

    if (accountExist) {
      next("Friend Request already sent.");
      return;
    }

    const newRes = await FriendRequest.create({
      requestTo,
      requestFrom: _id,
    });

    res.status(201).json({
      success: true,
      message: "Friend Request sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "you can not add friend , please try agin",
      success: false,
      error: error.message,
    });
  }
};
export const getFriendRequest = async (req, res) => {
  try {
    // const { userId } = req.body.user;
    const { _id } = req.user;
    const request = await FriendRequest.find({
      requestTo: _id,
      requestStatus: "pending",
    })
      .populate({
        path: "requestFrom",
        select: "firstName lastName profileUrl profession -password",
      })
      .limit(10)
      .sort({
        _id: -1,
      });

    res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "auth error",
      success: false,
      error: error.message,
    });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const { _id } = req.user;
    const { requestId, status } = req.body;

    const requestExist = await FriendRequest.findOne({ _id: requestId });
    if (!requestExist) {
      next("No friend request founded");
      return;
    }
    // return console.log(requestExist);
    const accept_friend = await FriendRequest.findByIdAndUpdate(
      requestId,
      { requestStatus: status },
      {
        new: true,
      }
    );

    // return console.log(accept_friend.requestStatus === "Accepted");

    if (accept_friend.requestStatus === "Accepted") {
      const user = await User.findById(_id);
      user.friends.push(accept_friend?.requestFrom);
      await user.save();

      // return console.log(user);

      const friend = await User.findById(accept_friend?.requestFrom);
      friend.friends.push(accept_friend?.requestFrom);
      await friend.save();
      // return console.log(friend);
    }
    res.status(200).json({
      success: true,
      message: "Friend Request" + status,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "auth error",
      error: error.message,
    });
  }
};

export const profileView = async (req, res) => {
  try {
    const { _id } = req.user;
    const userId = req.body;

    const user = await User.findById(_id);
    user.views.push(userId);
    await user.save();
    res.status(200).json({
      message: "you viewed this a new user",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "auth Error",
      success: false,
      error: error.message,
    });
  }
};

export const suggestedFriends = async (req, res) => {
  try {
    const { _id } = req.user;
    let queryObject = {};
    queryObject._id = { $ne: _id };
    queryObject.friends = { $nin: _id };
    let queryResult = User.find(queryObject)
      .limit(15)
      .select("firstName lastName profileUrl profession -password");
    const suggestFriends = await queryResult;
    res.status(200).json({
      success: true,
      data: suggestFriends,
    });
  } catch (error) {
    res.status(500).json({
      message: "auth Error",
      success: false,
      error: error.message,
    });
  }
};
