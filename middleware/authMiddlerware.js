const jwt = require("jsonwebtoken");
require("dotenv").config();
const generateToken = (user) => {
  const payload = {
    userId: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    mobile: user.mobile,
  };
  const option = { expiresIn: "2h" };

  const token = jwt.sign(payload, process.env.SECRETKEY, option);
  // console.log(token);
  return token;
};
module.exports = generateToken;
