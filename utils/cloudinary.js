const cloudinary = require("cloudinary").v2;
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });
cloudinary.config({
  cloud_name: "taher66",
  api_key: "669926646787936",
  api_secret: "QCpCCF2dYdgEqUPrC864DoGW58I",
});

module.exports = cloudinary;
