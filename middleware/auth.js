const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

exports.isAuth = async (req, res, next) => {
  console.log("");
  if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require("node-localstorage").LocalStorage;
    localStorage = new LocalStorage("../scratch");
  }
  const token = localStorage.getItem("token");
  try {
    const decode = jwt.decode(token, process.env.JWT_SECRET);
    const user = await User.findById(decode.userId);
    if (!user) {
      return res
        .status(403)
        .send({ status: false, message: "Unauthorized access" });
    }
    req.user = user;
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return res.send({ success: false, message: "Unauthorized access" });
    }
    if (err.name === "TokenExpiredError") {
      res.send({ success: false, message: "Session expired try sign in!" });
    }
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
};
