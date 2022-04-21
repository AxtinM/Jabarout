const express = require("express");
const { redirect } = require("express/lib/response");
const router = express.Router();
const User = require("../models/user.model");
require("dotenv").config();

const {
  loginValidator,
  registerValidator,
  userValidation,
} = require("../middleware/validation/user");
const jwt = require("jsonwebtoken");

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
        let oldTokens = user.tokens || [];
        if (oldTokens.length) {
          oldTokens = oldTokens.filter((token) => {
            const timeDiff = Date.now() - parseInt(token.signedAt) / 1000;
            if (timeDiff < 86400) return true;
          });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
          expiresIn: "1d",
        });
        await User.findByIdAndUpdate(user._id, {
          tokens: [
            ...oldTokens,
            { token: token, signedAt: Date.now().toString() },
          ],
        });

        if (typeof localStorage === "undefined" || localStorage === null) {
          var LocalStorage = require("node-localstorage").LocalStorage;
          localStorage = new LocalStorage("../scratch");
        }

        localStorage.setItem("token", token);
        console.log(localStorage.getItem("token"));
        res.redirect("/");
      } else {
        throw new Error("password and/or email must be correct");
      }
    } else {
      console.log(req.error);
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
