const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const adminLayout = "../views/layouts/admin";
const jwtSecret = process.env.JWT_SECRET;

router.get("/admin", async (req, res) => {
  try {
    const locals = {
      title: "Admin Page",
      description: "A Nodejs Blog App built with Nodejs, Express and MongoDB",
    };
    res.render("admin/index", { locals, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

router.get("/dashboard", async (req, res) => {
  res.render("admin/dashboard");
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "User does not exist " });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid Password" });
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret);
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(req.body);
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await User.create({ username, password: hashedPassword });
      res.status(201).json({ message: "User Created", user });
    } catch (error) {
      if (error.code === 11000) {
        res.status(409).json({ message: "user already is use" });
      }
      res.status(500).json({ message: "internal server error" });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
