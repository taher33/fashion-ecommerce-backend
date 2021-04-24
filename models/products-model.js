const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "can not be empty "],
  },

  details: {
    type: String,
    required: [true, "can not be empty "],
  },
  type: { type: String, enum: ["men", "women", "kids"], required: true },

  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },

  sold: { type: Number, default: 0 },

  image: { type: String, required: [true, "must specify image"] },

  createdAt: { type: Date, default: Date.now() },
  modifiedAt: { type: Date },
  rating: { type: Number, max: 5, min: 0.5, default: 3 },
});

productSchema.pre("save", function (next) {
  if (this.isNew) this.createdAt = Date.now();
  else this.modifiedAt = Date.now();
  next();
});

module.exports = mongoose.model("Product", productSchema);
