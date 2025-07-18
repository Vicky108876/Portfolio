const express = require("express");
const router = express.Router();
const Resume = require("../../models/Resume");
const Skill = require("../../models/Skills");
const Project = require("../../models/Project");
const Contact = require("../../models/Contact");
const About = require("../../models/About");
const Achievement = require("../../models/Achievement");

// Single route for rendering all content
router.get("/", async (req, res) => {
  try {
    const resume = await Resume.findOne();
    const skills = await Skill.find();
    const projects = await Project.find();
    const about = await About.findOne();
    const achieve = await Achievement.findOne();
    res.render("index", {
      resume,
      skills,
      projects,
      about,
      achieve,
    });
  } catch (err) {
    res.status(500).send("Error loading content");
  }
});

// Contact form submission
router.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;
  await Contact.create({ name, email, message });
  res.redirect("/#contact");
});

module.exports = router;
