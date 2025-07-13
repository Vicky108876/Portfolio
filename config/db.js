const mongoose = require("mongoose");
require("dotenv").config();
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI {
  ssl: true,
  sslValidate: false, // ✅ Disables cert validation — necessary for some hosts
});
    console.log("Connected to MongoDb");
  } catch (error) {
    console.error("Failed to connect ot MongoDb:", error);
  }
};
module.exports = connectDB;
