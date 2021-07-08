const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  product: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Product",
    required: [true, "product id is required"],
    unique: true,
  },
  amount: { type: Number, default: 1 },
  client: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
});

cartSchema.pre("find", function (next) {
  this.populate("product");
  next();
});

module.exports = mongoose.model("Cart", cartSchema);
