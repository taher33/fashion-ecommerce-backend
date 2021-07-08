const cartModel = require("../models/cart-model");
const appError = require("../utils/appError");

exports.getCartData = async (req, res, next) => {
  try {
    const cart = await cartModel.find({ client: req.user });

    res.json({
      cart,
    });
  } catch (err) {
    console.log(err);
    next(new appError(err.message, err.statusCode));
  }
};

exports.createCartEnterie = async (req, res, next) => {
  const { product } = req.body;
  try {
    const newEntrie = await cartModel.create({
      product,
      client: req.user,
    });

    res.json({
      newEntrie,
    });
  } catch (err) {
    console.log(err);
    next(new appError(err.message, err.statusCode));
  }
};

exports.removeFromCart = async (req, res, next) => {
  const { id } = req.params;

  try {
    await cartModel.deleteOne({ _id: id });
    res.status(204).json({ msg: "success" });
  } catch (err) {
    console.log(err);
    next(new appError(err.message, err.statusCode));
  }
};
