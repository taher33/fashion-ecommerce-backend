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
  const { title, name, type, price, stock } = req.body;
  try {
    const newProduct = await productModel.create({
      title,
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
