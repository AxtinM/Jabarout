const express = require("express");
const { redirect } = require("express/lib/response");
const router = express.Router();
const User = require("../models/user.model");
const {
  loginValidator,
  registerValidator,
  userValidation,
} = require("../middleware/validation/user");

router.get("/login", (req, res) => {
  res.render("../views/login");
});

// middleWare

router.post("/login", loginValidator, userValidation, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!req.error) {
      const user = await User.findOne({ email });
      if (await user.comparePasswords(password)) {
        res.redirect("/");
      } else {
        throw new Error("password and/or email must be correct");
      }
    } else {
      res.render("login", { error: req.error });
    }
  } catch (err) {
    res.render("login", { error: err });
  }
});

// get request (url entrer)
router.get("/register", (req, res) => {
  res.render("register");
});

// post request
router.post("/register", registerValidator, userValidation, (req, res) => {
  // console.log(req.body);
  try {
    if (!req.error) {
      const { fname, lname, email, password } = req.body;
      const user = new User({
        fname,
        lname,
        email,
        password,
      });
      user.save();
      res.redirect("/auth/login");
    } else {
      res.render("register", { error: req.error });
    }
  } catch (err) {
    res.render("register", { error: err });
  }
});

module.exports = router;
