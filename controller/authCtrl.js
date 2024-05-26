import { User } from "../model/userModel.js";
import { generateToken } from "../middleware/authMiddlerware.js";
import { sendVerificationEmail } from "../utils/sendEmail.js";
import { hashString } from "../utils/index.js";

//register
export const register = async (req, res, next) => {
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
  if (
    !(
      firstName ||
      lastName ||
      username ||
      gender ||
      email ||
      password ||
      mobile
    )
  ) {
    next("Provide Required Fields!");
    return;
  }

  try {
    const userExist = await User.findOne({ email });
    if (userExist) {
      next("Email Address already exists ");
      return;
    }
    // const hashPassword = await hashString(password);
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
    //send email verification to user
    sendVerificationEmail(createUser, res);

    res.status(200).json({
      message: "User Created Successfully",
      success: true,
    });
  } catch (error) {
    console.log(error.message);
    res.status(404).json({
      message: error.message,
      success: false,
    });
  }
};

export const login = async (req, res, next) => {
  // console.log(req.body);
  const { email, password } = req.body;
  try {
    //validation
    if (!email || !password) {
      next("Please Provide User Credentials");
      return;
    }
    //find user by email
    const user = await User.findOne({ email }).select("+password").populate({
      path: "friends",
      select: "firstName lastName location profileUrl password",
    });
    // return console.log(user);
    if (!user) {
      return res.status(401).json("Invalid  email or password");
    }
    if (!user?.verified || user?.verified === false) {
      next(
        "user email is not verified.check your email account and verify your email"
      );
      return;
    }

    if (!user && (await user.checkPassword(password))) {
      next("invalid email or password");
      return;
    }

    // console.log(user);
    user.password = undefined;
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
    res.status(201).json({
      success: true,
      message: "Login with successFully",
      user,
      refreshToken,
    });
  } catch (err) {
    throw new Error(err);
  }
};
