const productModel = require("../models/products-model");

exports.getProducts = async (req, res) => {
  const products = await productModel.find();
  res.json({
    products,
  });
};
