const fs = require("fs");
const productModel = require("../models/products-model");
const apiFeatures = require("../utils/api-features");
const multer = require("multer");
const appError = require("../utils/appError");

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

exports.getProducts = async (req, res) => {
  try {
    const feature = new apiFeatures(productModel.find(), req.query)
      .filter()
      .limitFields()
      .sort()
      .pagination();
    const products = await feature.query;
    res.json({
      products,
    });
  } catch (err) {
    res.status(500).json({
      err,
    });
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
    next(new appError("database err", 500));
    console.log(err);
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
