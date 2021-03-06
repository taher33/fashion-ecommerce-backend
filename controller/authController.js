const usersModel = require("../models/users-model");
const jwt = require("jsonwebtoken");
const { checkPassword } = require("../utils/checkpass");
const { promisify } = require("util");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "cute cat", {
    expiresIn: process.env.JWT_EXPIRES_IN || 3600 * 1000 * 24,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  console.log(token);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_IN * 3600 * 1000 || 3600 * 1000 * 55
    ),
    maxAge: process.env.JWT_COOKIE_IN * 3600 * 1000 || 3600 * 1000 * 55,
    httpOnly: true,
  };
  //   if (process.env.NODE_ENV === "prod") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  res.status(statusCode).json({
    status: "success",
    user,
  });
};

exports.signup = async (req, res) => {
  try {
    const newUser = await usersModel.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConf,
      role: req.body.role,
    });
    createSendToken(newUser, 200, res);
  } catch (err) {
    res.status(400).json({
      msg: "failed",
      err,
    });
    console.log(err);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        msg: "must specify password and email",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (
      user === null ||
      (await checkPassword(password, user.password)) === false
    ) {
      return res.status(400).json({
        msg: "wrong password or user does not exist",
      });
    }

    createSendToken(user, 200, res);
  } catch (error) {
    res.status(500).json({ err });
  }
};

exports.protect = (adminOnly = false) => async (req, res, next) => {
  try {
    let token;

    if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    if (!token) {
      return res.status(401).json({
        msg: "login",
      });
    }

    // jwt.verify(token,"cute cat", (err, result) => {});

    const decoded = await promisify(jwt.verify)(token, "cute cat");

    const frechUser = await usersModel.findById(decoded.id);
    if (!frechUser) {
      return res.status(401).json({
        msg: "user does not exist",
      });
    }

    if (adminOnly) {
      if (frechUser.role === "user") {
        return res.status(403).json({
          msg: "u are not allowed access",
        });
      }
    }
    // if (!frechUser.checkPassChanged(token.iat)) {
    //   return next(new appError("plz login again u changed password", 401));
    // }
    req.user = frechUser;
    next();
  } catch (err) {
    console.log(err);
    res.json({ err });
  }
};

exports.checkAuth = (req, res) => {
  res.json({ msg: "hey there", user: req.user });
};
