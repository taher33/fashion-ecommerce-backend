const express = require("express");

const { protect } = require("../controller/authController");
const {
  getCartData,
  createCartEnterie,
  removeFromCart,
} = require("../controller/cartController");
const router = express.Router();

router.get("/", protect(), getCartData);
router.post("/", protect(), createCartEnterie);

router.delete("/:id", protect(), removeFromCart);

module.exports = router;
