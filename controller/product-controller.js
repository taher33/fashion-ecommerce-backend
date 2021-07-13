const fs = require("fs");
const productModel = require("../models/products-model");
const apiFeatures = require("../utils/api-features");
const multer = require("multer");
const appError = require("../utils/appError");
const orderModel = require("../models/order-model");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "imgs");
  },
  filename: (req, file, cb) => {
    //geting the extention : jpeg and such
    const ext = file.mimetype.split("/")[1];
    cb(null, `product-${req.user._id}-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image") && file.mimetype.endsWith("png")) {
    cb(null, true);
  } else {
    cb(new appError("not an a png", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadPostImg = upload.single("picture");

exports.getProducts = async (req, res, next) => {
  try {
    const feature = new apiFeatures(productModel.find(), req.query)
      .filter()
      .limitFields()
      .sort()
      .pagination();
    const products = await feature.query;

    res.json({
      length: products.length,
      products,
    });
  } catch (err) {
    next(new appError("something went wrong", 500, err.errors));
  }
};

exports.getOneProduct = async (req, res, next) => {
  const { id } = req.params;
  if (!id) return next(new appError("provide an id", 400));
  try {
    const product = await productModel.findById(id);

    if (!product)
      return next(
        new appError("the id you provided did not match any records", 404)
      );
    res.json({
      product,
    });
  } catch (err) {
    next(new appError("something went wrong", 500, err.errors));
  }
};

exports.createProduct = async (req, res, next) => {
  if (req.file === undefined) {
    next(new appError("must specify an image", 400));
  }

  const { title, name, type, price, stock, details } = req.body;
  try {
    const newProduct = await productModel.create({
      title,
      details,
      name,
      type,
      price,
      stock,
      image: req.file.filename,
    });

    res.status(201).json({
      newProduct,
    });
  } catch (err) {
    // res.json(err);
    next(new appError(err.message, 500, err.errors));
  }
};

exports.buyProduct = async (req, res, next) => {
  try {
    const { product_id, amount } = req.body;
    if (!product_id) return next(new appError("product Id is required", 400));
    const changed_product = await productModel.findById(product_id);
    changed_product.stock = changed_product.stock * 1 - amount;
    changed_product.sold = changed_product.sold * 1 + amount;
    changed_product.save({ validateBeforeSave: false });

    const newOrder = await orderModel.create({
      productName: changed_product.title,
      client: req.user._id,
      amount,
      price: amount * changed_product.price,
    });

    res.json({
      newOrder,
    });
  } catch (err) {
    next(new appError("something went wrong ", 500, err.errors));
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { product_id, ...changes } = req.body;
    if (!product_id) return next(new appError("must specify a product"));
    const updated_product = await productModel.updateOne(changes);
    res.json({ msg: "updated a product ", updated_product });
  } catch (error) {
    next(new appError("err had occured", 400));
  }
};

exports.deletProduct = async (req, res, next) => {
  try {
    const { product_id } = req.body;
    if (!product_id) return next(new appError("must specify a product"));
    await productModel.deleteOne({ _id: product_id });
    res.json({
      msg: "item removed",
    });
  } catch (err) {
    next(new appError("an error occured", 400));
  }
};

exports.deleteAll = async (req, res) => {
  const products = await productModel.find();
  products.forEach((el) => {
    fs.unlink("imgs/" + el.image, (err) => {
      if (err) {
        console.error(err);
        return;
      }

      //file removed
    });
  });
  await productModel.deleteMany();
  res.json({
    msg: "succcess",
  });
};
