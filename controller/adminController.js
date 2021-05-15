const orderModel = require("../models/order-model");
const productModel = require("../models/products-model");
const appError = require("../utils/appError");
const moment = require("moment");

exports.adminData = async (req, res, next) => {
  const days = Last7Days();
  try {
    const model = await orderModel.aggregate([
      { $match: { day: { $in: days } } },
      {
        $group: {
          _id: "$day",
          total: { $sum: "$price" },
          total_items: { $sum: "$amount" },
        },
      },
      { $sort: { day: 1 } },
    ]);

    const data = days.map((el) => {
      let index = model.findIndex((element) => {
        return element._id === el;
      });

      if (index !== -1) {
        return model[index];
      }
      return {
        _id: el,
        total: 0,
        total_items: 0,
      };
    });

    res.json({
      amount: model.length,
      data,
    });
  } catch (error) {
    console.log(error);
  }
};

function Last7Days() {
  let result = [];
  for (let i = 0; i < 7; i++) {
    let day = moment().subtract(i, "days").format("MM[/]DD[/]YYYY");

    result.push(day);
  }

  return result;
}
