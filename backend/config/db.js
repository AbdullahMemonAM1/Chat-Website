const expressAsyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const connDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log("is connected");
  } catch (error) {
    console.log("error occurred");
    process.exit();
  }
};

module.exports = connDB;
