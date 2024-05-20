import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    let connection = await mongoose.connect("mongodb://127.0.0.1/facebook");
    console.log("Database Connected");
  } catch (err) {
    console.log(err);
  }
};
export default dbConnect;
