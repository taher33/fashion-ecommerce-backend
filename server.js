const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");

const mongoose = require("mongoose");
const products = require("./routes/products");
const users = require("./routes/users");
const cart = require("./routes/cart");
const admin = require("./routes/admin");
const appError = require("./utils/appError");
const errHandler = require("./controller/errController");

const dotenv = require("dotenv").config({
  path: "./config.env",
});

const app = express();
const PORT = process.env.PORT || 5000;

const whiteList = [
  "https://fashion-ecommerce-lime.vercel.app",
  "fashion-ecommerce-taher33.vercel.app",
  "fashion-ecommerce-git-main-taher33.vercel.app",
  "http://localhost:3000",
];

app.use(
  cors({
    credentials: true,
    // origin: "http://localhost:3000",
    origin: function (origin, callback) {
      if (whiteList.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use(
  express.urlencoded({
    extended: false,
  })
);

if (process.env.NODE_ENV === "dev") app.use(morgan("dev"));

app.use(cookieParser());

app.use(express.json());

// app.use(express.static(path.join(__dirname, "imgs")));
app.use(express.static("imgs"));
app.get("/", (req, res) => {
  res.send("hey there");
});

app.use("/products", products);
app.use("/admin", admin);
app.use("/users", users);
app.use("/cart", cart);

app.all("*", (req, res, next) => {
  next(new appError(`cant find ${req.originalUrl} on this server`, 404));
});

app.use(errHandler);

mongoose.connect(
  `mongodb+srv://taher:${
    process.env.MONGO_DB_NAME || "taher"
  }@pacebook.f21hd.mongodb.net/${
    process.env.MONGO_DB_PASSWORD || "pacebook"
  }?retryWrites=true&w=majority`,

  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  () => {
    console.log("connected to data base");
  }
);

app.listen(PORT, () => {
  console.log("started server on port : " + PORT);
});
