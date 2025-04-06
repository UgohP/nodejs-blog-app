const express = require("express");
const router = express.Router();
const Blog = require("../models/blog");

//to get all the blogs
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

//to get a particular blog
router.get("/blog/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Blog.findById({ _id: id });

    const locals = {
      title: data.title,
      description: "A Nodejs Blog App built with Nodejs, Express and MongoDB",
    };

    res.render("blog", { locals, data });
  } catch (error) {
    console.log(error);
  }
});

//using post request to get a searched blog
router.post("/search", async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "");
    const data = await Blog.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, "i") } },
        { body: { $regex: new RegExp(searchNoSpecialChar, "i") } },
      ],
    });

    const locals = {
      title: searchTerm,
      description: "A Nodejs Blog App built with Nodejs, Express and MongoDB",
    };

    res.render("search", { locals, data });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
