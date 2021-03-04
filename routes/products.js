const express = require("express");
const productsModel = require("../models/products-model");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    msg: "yoo",
    products: ["yi", "jz"],
  });
});

router.post("/", async (req, res) => {
  try {
    await productsModel.create({
      title: "hey",
      name: "hey",
      price: 5,
    });
    res.json({ msg: "yeah boy" });
  } catch (err) {
    console.log(err);
    res.status(500);
  }
});

module.exports = router;
