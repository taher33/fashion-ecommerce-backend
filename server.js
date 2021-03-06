const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const products = require("./routes/products");
const users = require("./routes/users");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

app.use(
  express.urlencoded({
    extended: false,
  })
);

// if (process.env.NODE_ENV === "dev")
app.use(morgan("dev"));

app.use(cookieParser());

app.use(express.json());

// app.use(express.static(path.join(__dirname, "imgs")));

app.use("/products", products);
app.use("/users", users);

app.all("*", (req, res, next) => {
  // next(new appError(`cant find ${req.originalUrl} on this server`, 404));
  res.status(400).json({
    msg: "error has acured",
  });
});

mongoose.connect(
  `mongodb+srv://taher:${
    process.env.MONGO_DB_PASSWORD || "taher"
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
