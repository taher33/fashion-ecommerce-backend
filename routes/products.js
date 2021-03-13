const express = require("express");
const { protect } = require("../controller/authController");
const router = express.Router();
const {
  getProducts,
  uploadPostImg,
  createProduct,
} = require("../controller/product-controller");

router.get("/", getProducts);

router.post("/", protect(true), uploadPostImg, createProduct);

module.exports = router;
