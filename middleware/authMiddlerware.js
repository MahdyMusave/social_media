import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  const payload = {
    userId: user.id,
    firstName: user.firstName,
  };
  const option = { expiresIn: "2h" };

  const token = jwt.sign(payload, process.env.SECRETKEY, option);
  // console.log(token);
  return token;
};
