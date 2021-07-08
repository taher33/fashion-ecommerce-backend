const mongoose = require("mongoose");
const moment = require("moment");

const orderSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: [true, "product name is required"],
  },
  date: { type: Date, default: Date.now() },

  day: {
    type: String,
    default: `${moment().format("L")}`,
  },
  client: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
  amount: { type: Number, default: 1 },
  price: { type: Number },
});

module.exports = mongoose.model("Order", orderSchema);
