const mongoose = require("mongoose");
const validate = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "a name is required"],
    // minLength: {
    //   value: 3,
    //   message: "name must be more then 3 charachters",
    // },
    minLength: [3, "name must more then 3 charachters"],
  },
  email: {
    type: String,
    required: true,
    unique: [true, "email already taken"],
    lowercase: true,
    validate: [validate.isEmail, "please provide valid email"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
    minLength: [8, "min password length is 8 charachters"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: true,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "password and the confirm password are not the same",
    },
    select: false,
  },

  role: { type: String, enum: ["user", "admin", "mod"], default: "user" },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    // still needs work here
    type: Date,
    default: Date.now(),
  },
  //   passwordResetToken: String,
  //   passwordResetTime: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  // hash the password
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (this.isNew) this.createdAt = Date.now();
  else this.modifiedAt = Date.now();
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  // some times the DB is slower then the jwt token so we take one seconde to not run into problemes in login
  this.passwordChanged = Date.now() - 1000;
  next();
});

userSchema.methods.checkPassword = async function (candidatePass, userPass) {
  return await bcrypt.compare(candidatePass, userPass);
};

module.exports = mongoose.model("User", userSchema);
