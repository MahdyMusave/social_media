import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";

export const hashString = async (useValue) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(useValue, salt);
  return hashedPassword;
};

export const compareString = async (userPassword, password) => {
  // return console.log(userPassword, password);
  const isMatch = await bcrypt.compare(userPassword, password);
  // return console.log(isMatch == true);
  return isMatch;
};

export const createToken = async (id) => {
  return JWT.sign({ userId: id }, process.env.SECRETKEY, {
    expiresIn: "1d ",
  });
};
