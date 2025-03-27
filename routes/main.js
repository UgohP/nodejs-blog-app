const express = require("express");
const router = express.Router();
const Blog = require("../models/blog");

router.get("", async (req, res) => {
  const locals = {
    title: "Nodejs Blog App",
    description: "A Nodejs Blog App built with Nodejs, Express and MongoDB",
  };
  try {
    const data = await Blog.find();
    res.render("index", { locals, data });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
