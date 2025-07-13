const mongoose = require("mongoose");
require("dotenv").config();
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ssl: true,
      tlsAllowInvalidCertificates: false,
    }););
    console.log("Connected to MongoDb");
  } catch (error) {
    console.error("Failed to connect ot MongoDb:", error);
  }
};
module.exports = connectDB;
