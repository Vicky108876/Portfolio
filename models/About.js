const mongoose = require("mongoose");

const aboutSchema = new mongoose.Schema({
  description: String,
  image: String,
});

module.exports = mongoose.model("About", aboutSchema);
