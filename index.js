const express = require("express");
const app = express();
const router = require("./routes");
const mongoose = require("mongoose");
const Post = require("./models/post.model");
const { isAuth } = require("./middleware/auth");
const { redirect } = require("express/lib/response");

require("dotenv").config();

// Database connection
require("./models/db");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", router);

app.use(express.static(__dirname + "/public"));

// set up express app to use ejs engine
app.set("view engine", "ejs");

// env variables :
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  Post.find({}, (err, posts) => {
    if (err) {
      console.log(err);
    } else {
      res.render("index", {
        posts: posts,
      });
    }
  });
});

app.get("/posts/add", (req, res) => {
  res.render("addpost");
});

app.post("/posts/add", (req, res) => {
  const { description } = req.body;
  console.log(req.body);
  const post = new Post({ description: description });
  post
    .save()
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/posts/edit/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.render("editpost", { post: post });
});

app.post("/posts/edit/:id", isAuth, async (req, res) => {
  const { description } = req.body;
  const post = await Post.findById(req.params.id);
  post.description = description;
  post.save();
  res.redirect(`/posts/edit/${req.params.id}`);
});

app.get("/posts/delete/:id", isAuth, async (req, res) => {
  const id = req.params.id;
  await Post.findByIdAndDelete(id);
  res.redirect("/");
});

router.get("/profile", isAuth, async (req, res) => {
  const user = req.user;
  res.render("profile", { user: user });
});

router.post("/profile/edit", isAuth, async (req, res) => {
  const user = req.user;
  const { fname, lname, email } = req.body;
  user.fname = fname;
  user.lname = lname;
  user.email = email;
  console.log(fname);
  console.log(user);
  user.save();
  res.redirect("/profile");
});

// setting up app to listen on port 3000
app.listen(port, () => {
  console.log("listening on port " + port);
});
