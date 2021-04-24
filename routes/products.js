const express = require("express");
const { protect } = require("../controller/authController");
const router = express.Router();
const {
  getProducts,
  uploadPostImg,
  createProduct,
  deleteAll,
  deletProduct,
  updateProduct,
} = require("../controller/product-controller");

router.get("/", getProducts);

router.post("/", protect(true), uploadPostImg, createProduct);

router.patch("/", protect(true), updateProduct);

router.delete("/", protect(true), deletProduct);
router.delete("/", protect(true), deleteAll);

module.exports = router;
