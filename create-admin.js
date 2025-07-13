const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./models/Admin");

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/protfolio")
  .then(() => {
    const password = bcrypt.hashSync("Vignesh@123", 10); 
    return Admin.create({ username: "Vicky_M", password });
  })
  .then(() => {
    console.log("✅ Admin created");
    process.exit();
  })
  .catch((err) => {
    console.error("❌ Error creating admin:", err);
    process.exit(1);
  });
