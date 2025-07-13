const mongoose = require("mongoose");
const resumeSchema = new mongoose.Schema({
  title: String,
  role: String,
  quote: String,
  image: String,
  url: String,
});
module.exports = mongoose.model("Resume", resumeSchema);
