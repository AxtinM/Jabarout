const express = require("express");
const app = express();
const router = require("./routes");
const mongoose = require("mongoose");
const Post = require("./models/post.model");
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

app.get("/posts/delete/:id", async (req, res) => {
  const id = req.params.id;
  await Post.findByIdAndDelete(id);
  res.redirect("/");
});

// setting up app to listen on port 3000
app.listen(port, () => {
  console.log("listening on port " + port);
});
