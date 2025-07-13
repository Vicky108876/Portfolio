const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const router = require("./routes");
require("dotenv").config();
const session = require("express-session");
const MongoStore = require("connect-mongo");
const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

connectDB();
app.use("/", router);

// Session Setup
app.use(
  session({
    secret:process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
    cookie: { secure: false },
  })
);

// Routes
app.use("/", require("./routes/getRoutes/index"));
app.use("/admin", require("./routes/postRoutes/index"));

app.listen(process.env.PORT || 5000, () => {
  console.log("5000 server is running");
});
