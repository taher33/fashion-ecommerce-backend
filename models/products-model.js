const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "can not be empty "],
  },

  name: {
    type: String,
    required: [true, "can not be empty "],
  },

  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },

  imgs: [String],

  createdAt: { type: Date, default: Date.now() },
  modifiedAt: { type: Date },
});

productSchema.pre("save", function (next) {
  if (this.isNew) this.createdAt = Date.now();
  else this.modifiedAt = Date.now();
  next();
});

module.exports = mongoose.model("Product", productSchema);
