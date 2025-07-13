const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const session = require("express-session");
const About = require("../models/About");
const Admin = require(".../models/Admin");
const Resume = require("../models/Resume");
const Skill = require("../models/Skills");
const Project = require("../models/Project");
const Contact = require("../models/Contact");
const Achievement = require("../models/Achievement");
const multer = require("multer");
const path = require("path");
const { Certificate } = require("crypto");

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // e.g. 162885.jpg
  },
});

const upload = multer({ storage });

// Middleware to check login
function isLoggedIn(req, res, next) {
  if (req.session.adminId) return next();
  res.redirect("/admin/login");
}

// Login Page
router.get("/login", (req, res) => {
  res.render("admin/login");
});

// Handle Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });
  console.log(admin);
  if (admin && bcrypt.compareSync(password, admin.password)) {
    req.session.adminId = admin._id;
    res.redirect("/admin/dashboard");
  } else {
    res.send("Invalid credentials");
  }
});

// Dashboard
router.get("/dashboard", isLoggedIn, (req, res) => {
  res.render("admin/dashboard");
});

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/admin/login");
});

// Manage Resume
router.get("/resume", isLoggedIn, async (req, res) => {
  const resume = await Resume.findOne();
  res.render("admin/resume", { resume });
});

router.post(
  "/resume",
  isLoggedIn,
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      await Resume.deleteMany();

      const newResume = {
        title: req.body.title,
        role: req.body.role,
        quote: req.body.quote,
        image: req.files["image"] ? req.files["image"][0].filename : null,
        url: req.files["resume"] ? req.files["resume"][0].filename : null,
      };

      await Resume.create(newResume);
      res.redirect("/admin/resume");
    } catch (err) {
      console.error(err);
      res.status(500).send("Something went wrong.");
    }
  }
);

router.get("/achievement", isLoggedIn, async (req, res) => {
  const Achievements = await Achievement.findOne();
  res.render("admin/achievement", { Achievements });
});
router.post("/achievement", isLoggedIn, async (req, res) => {
  try {
    await Achievement.deleteMany();
    console.log("success");
    const newachieve = {
      certificate: parseInt(req.body.certificates || 0),
      internship: parseInt(req.body.internships || 0),
    };
    console.log("success");
    await Achievement.create(newachieve);
    res.redirect("/admin/achievement");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Manage Skills
router.get("/skills", isLoggedIn, async (req, res) => {
  const skills = await Skill.find();
  res.render("admin/skills", { skills });
});

router.post("/skills", isLoggedIn, async (req, res) => {
  await Skill.create({ name: req.body.name });
  res.redirect("/admin/skills");
});

router.post("/skills/delete/:id", isLoggedIn, async (req, res) => {
  await Skill.findByIdAndDelete(req.params.id);
  res.redirect("/admin/skills");
});
// Manage About
router.get("/about", isLoggedIn, async (req, res) => {
  const about = await About.findOne();
  res.render("admin/about", { about });
});

router.post("/about", upload.single("image"), async (req, res) => {
  await About.create({
    description: req.body.description,
    image: req.file.filename,
  });
  res.redirect("/admin/about");
});
// Update About
router.post(
  "/about/update/:id",
  isLoggedIn,
  upload.single("image"),
  async (req, res) => {
    const updateData = {
      description: req.body.description,
    };

    if (req.file) {
      updateData.image = req.file.filename;
    }

    await About.findByIdAndUpdate(req.params.id, updateData);
    res.redirect("/admin/about");
  }
);

// Delete About
router.post("/about/delete/:id", isLoggedIn, async (req, res) => {
  await About.findByIdAndDelete(req.params.id);
  res.redirect("/admin/about");
});

// Manage Projects
router.get("/projects", isLoggedIn, async (req, res) => {
  const projects = await Project.find();
  res.render("admin/projects", { projects });
});

router.post(
  "/projects",
  isLoggedIn,
  upload.single("image"),
  async (req, res) => {
    const { title, description, github } = req.body;
    const image = "/uploads/" + req.file.filename;
    await Project.create({ title, description, github, image });
    res.redirect("/admin/projects");
  }
);

router.post("/projects/delete/:id", isLoggedIn, async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.redirect("/admin/projects");
});

router.post(
  "/projects/update/:id",
  isLoggedIn,
  upload.single("image"),
  async (req, res) => {
    const { title, description, github } = req.body;
    const updateData = { title, description, github };

    if (req.file) {
      updateData.image = "/uploads/" + req.file.filename;
    }

    await Project.findByIdAndUpdate(req.params.id, updateData);
    res.redirect("/admin/projects");
  }
);

// View Contacts
router.get("/contacts", isLoggedIn, async (req, res) => {
  const contacts = await Contact.find().sort({ date: -1 });
  res.render("admin/contacts", { contacts });
});

module.exports = router;
