import JWT from "jsonwebtoken";
import { User } from "../model/userModel.js";

export const generateToken = (user) => {
  const payload = {
    userId: user.id,
    firstName: user.firstName,
  };
  const option = { expiresIn: "2h" };

  const token = JWT.sign(payload, process.env.JWT_SECRET, option);
  // console.log(token);
  return token;
};

//auth middlerware
export const userAuth = async (req, res, next) => {
  let token;

  if (req?.headers?.authorization?.startsWith("Bearer")) {
    // return console.log(req.headers.authorization);
    token = req.headers.authorization.split(" ")[1];

    try {
      if (token) {
        const decode = JWT.verify(token, process.env.JWT_SECRET);
        // console.log(decode);
        req.body.user = {
          userId: decode.userId,
        };
        const user = await User.findOne({ _id: decode.userId });
        req.user = user;
        next();
      }
    } catch (error) {
      res.status(404).json({
        message: "Authentication failed ",
        success: false,
      });
    }
  } else {
    throw new Error("there is no token attached to header");
  }
};
