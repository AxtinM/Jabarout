const mongoose = require("mongoose");
const argon2 = require("argon2");
const res = require("express/lib/response");
const { Schema, model } = mongoose;

const userSchema = new Schema({
  fname: {
    required: true,
    maxlength: 30,
    type: String,
  },
  lname: {
    required: true,
    maxlength: 30,
    type: String,
  },
  email: { required: true, unique: true, type: String },
  password: { required: true, type: String },
  // profile_picture: { type: Buffer },
  tokens: [{ type: Object }],
  posts: [{ type: Object }],
  friends: [{ type: Schema.Types.ObjectId }],
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      const hashed_password = await argon2.hash(this.password);
      this.password = hashed_password;
      next();
    } catch (err) {
      console.log(err);
    }
  }
});

userSchema.methods.comparePasswords = async function (password) {
  try {
    return await argon2.verify(this.password, password);
  } catch (err) {
    console.log("error comparing passwords: " + err);
  }
};

const User = model("User", userSchema);
module.exports = User;
