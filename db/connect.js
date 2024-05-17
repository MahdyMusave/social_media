const mongoose = require("mongoose");
//Set up default mongoose connection
const dbConnect = async () => {
  try {
    let mongoDB = await mongoose.connect("mongodb://127.0.0.1/facebook");
    console.log("Database Connected");
  } catch (err) {
    console.log(err);
  }
};
module.exports = dbConnect;
