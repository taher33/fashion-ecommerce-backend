const express = require("express");
const {
  signup,
  login,
  protect,
  checkAuth,
} = require("../controller/authController");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    msg: "yoo",
    products: ["yi", "jz"],
  });
});
router.get("/checkAuth", protect(true), checkAuth);
router.post("/signup", signup);
router.post("/login", login);

module.exports = router;
