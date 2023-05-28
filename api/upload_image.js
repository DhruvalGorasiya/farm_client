var express = require("express");
var app = express();
// var imgSchema = require("../model/image_upload/image.upload.model");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const imageId = uuidv4();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
const uploadImg = multer({ storage: storage }).single("image");

app.post("/uploads", uploadImg, (req, res) => {
  console.log(req.body);
  res.status(200).send({
    status: true,
    message: "image Uploaded",
    imageUrl: `http://${req.headers.host}${req.url}/${req.file.path
      .split("\\")
      .pop()}`,
  });
});

module.exports = app;
