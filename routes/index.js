const authRoutes = require("./auth.routes");
const router = require("express").Router();

router.use("/auth", authRoutes);
module.exports = router;
