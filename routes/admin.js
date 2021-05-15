const express = require("express");
const { adminData } = require("../controller/adminController");
const { protect } = require("../controller/authController");
const router = express.Router();

router.get("/", protect(true), adminData);

module.exports = router;
