const mongoose = require("mongoose");
const AchievementSchema = new mongoose.Schema({
  certificate: { type: Number },
  internship: { type: Number },
});
module.exports = mongoose.model("Achievement", AchievementSchema);
