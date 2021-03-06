const express = require("express");
const { signup, login } = require("../controller/authController");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    msg: "yoo",
    products: ["yi", "jz"],
  });
});

router.post("/signup", signup);
router.post("/login", login);

module.exports = router;
