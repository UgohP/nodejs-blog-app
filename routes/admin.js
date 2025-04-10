const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Blog = require("../models/blog");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const adminLayout = "../views/layouts/admin";
const jwtSecret = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    res.redirect("/admin");
  }
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorised" });
  }
};

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
  try {
    const locals = {
      title: "Dashboard",
      description: "A Nodejs Blog App built with Nodejs, Express and MongoDB",
    };
    const data = await Blog.find();
    res.render("admin/dashboard", { locals, data, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
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

router.get("/add-blog", async (req, res) => {
  try {
    const locals = {
      title: "Add new blog",
      description: "A Nodejs Blog App built with Nodejs, Express and MongoDB",
    };
    res.render("admin/add-blog", { locals, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

router.post("/add-blog", async (req, res) => {
  try {
    try {
      const { title, body } = req.body;
      const newBlog = new Blog({
        title: req.body.title,
        body: req.body.body,
      });
      await Blog.create(newBlog);
      res.redirect("/dashboard");
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/edit-blog/:id", async (req, res) => {
  try {
    const locals = {
      title: "Add new blog",
      description: "A Nodejs Blog App built with Nodejs, Express and MongoDB",
    };
    const data = await Blog.findOne({ _id: req.params.id });
    res.render("admin/edit-blog", { locals, data, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

router.put("/edit-blog/:id", async (req, res) => {
  try {
    await Blog.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      body: req.body.body,
      updatedAt: Date.now(),
    });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});

router.delete("/delete-blog/:id", async (req, res) => {
  try {
    await Blog.deleteOne({ _id: req.params.id });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});

router.get("/logout", async (req, res) => {
  res.clearCookie("token");
  res.redirect("/admin");
});
module.exports = router;
