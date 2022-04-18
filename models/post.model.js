const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const postSchema = new Schema({
  title: { type: String },
  description: { type: String },
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

const Post = model("Post", postSchema);
module.exports = Post;
