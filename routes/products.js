const express = require("express");
const { getProducts } = require("../controller/product-controller");
const productsModel = require("../models/products-model");
const router = express.Router();

router.get("/", getProducts);

router.post("/", async (req, res) => {
  try {
    await productsModel.create({
      title: "hey",
      name: "hey",
      price: 5,
      stock: 5,
    });
    res.json({ msg: "yeah boy" });
  } catch (err) {
    res.status(400).json({
      err,
    });
    console.log(err);
  }
});

module.exports = router;
