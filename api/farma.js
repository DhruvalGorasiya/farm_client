const express = require("express");
const app = express();
const FarmModel = require("../model/farm/farm_model");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const imageId = uuidv4();
var fs = require("fs");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./uploads`);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now() + file.originalname}`);
  },
});

const uploadImg = multer({ storage: storage });

app.post("/add", uploadImg.single("file"), async (req, res) => {
  if (!req.body.farm_name) {
    res.status(406).json({
      success: false,
      message: "farm_name is Required",
    });
  } else if (!req.file) {
    res.status(406).json({
      success: false,
      message: "file is Required",
    });
  } else {
    var farmModel = FarmModel({
      farm_name: req.body.farm_name,
      image: `http://${req.headers.host}/uploads/${req.file.path
        .split("\\")
        .pop()}`,
    });
    await farmModel
      .save()
      .then((data) => {
        return res.status(200).send({
          status: true,
          message: "Farm created successfully",
          data: {
            id: data.id,
            farm_name: data.farm_name,
            image: data.image,
          },
        });
      })
      .catch((fail) => {
        console.log(fail);
        if (fail) {
          if (fail.name === "MongoServerError" && fail.code === 11000) {
            if (fail.keyValue.farm_name) {
              return res.status(409).send({
                succes: false,
                message: "farm_name already exist!",
              });
            } else {
              return res.status(500).send({
                succes: false,
                message: "Something went to wrong",
                error: fail.message,
              });
            }
          } else {
            return res.status(500).send({
              succes: false,
              message: "Something went to wrong",
              error: fail.message,
            });
          }
        }
      });
  }
});

app.post("/update", uploadImg.single("file"), async (req, res) => {
  if (!req.body.id) {
    res.status(406).json({
      success: false,
      message: "id is Required",
    });
  } else if (!req.body.farm_name) {
    res.status(406).json({
      success: false,
      message: "farm_name is Required",
    });
  } else {
    // if (req.file) {
    //   await FarmModel.findOneAndUpdate(
    //     { _id: req.body.id },
    //     {
    //       farm_name: req.body.farm_name,
    //       image: `http://${req.headers.host}/uploads/${req.file.path
    //         .split("\\")
    //         .pop()}`,
    //     }
    //   )
    //     .then(async () => {
    //       await FarmModel.find({ _id: req.body.id })
    //         .exec()
    //         .then((data) => {
    //           return res.status(200).send({
    //             status: true,
    //             message: "Farm created successfully",
    //             data: {
    //               id: data[0].id,
    //               farm_name: data[0].farm_name,
    //               image: data[0].image,
    //             },
    //           });
    //         });
    //     })
    //     .catch((fail) => {
    //       console.log(fail);
    //       if (fail) {
    //         if (fail.name === "MongoServerError" && fail.code === 11000) {
    //           if (fail.keyValue.farm_name) {
    //             return res.status(409).send({
    //               succes: false,
    //               message: "farm_name already exist!",
    //             });
    //           } else {
    //             return res.status(500).send({
    //               succes: false,
    //               message: "Something went to wrong",
    //               error: fail.message,
    //             });
    //           }
    //         } else {
    //           return res.status(500).send({
    //             succes: false,
    //             message: "Something went to wrong",
    //             error: fail.message,
    //           });
    //         }
    //       }
    //     });
    // } else {
    if (req.file) {
      await FarmModel.find({ _id: req.body.id }).then((data) => {
        const filePath = path.join(
          path.resolve("./"),
          "./uploads",
          data[0].image.split("/").pop()
        );
        try {
          console.log(filePath);
          fs.unlinkSync(filePath);
          console.log("Delete File successfully.");
        } catch (error) {
          console.log(error);
        }
      });
    }
    await FarmModel.findOneAndUpdate(
      { _id: req.body.id },
      {
        farm_name: req.body.farm_name,
        image: `http://${req.headers.host}/uploads/${req.file.path
          .split("\\")
          .pop()}`,
      }
    )
      .then(async () => {
        await FarmModel.find({ _id: req.body.id })
          .exec()
          .then((data) => {
            return res.status(200).send({
              status: true,
              message: "Farm created successfully",
              data: {
                id: data[0].id,
                farm_name: data[0].farm_name,
                image: data[0].image,
              },
            });
          });
      })
      .catch((fail) => {
        console.log(fail);
        if (fail) {
          if (fail.name === "MongoServerError" && fail.code === 11000) {
            if (fail.keyValue.farm_name) {
              return res.status(409).send({
                succes: false,
                message: "farm_name already exist!",
              });
            } else {
              return res.status(500).send({
                succes: false,
                message: "Something went to wrong",
                error: fail.message,
              });
            }
          } else {
            return res.status(500).send({
              succes: false,
              message: "Something went to wrong",
              error: fail.message,
            });
          }
        }
      });
  }
  // }
});

app.post("/delete", async (req, res) => {
  if (!req.body.id) {
    res.status(406).json({
      success: false,
      message: "id is Required",
    });
  } else {
    await FarmModel.find({ _id: req.body.id })
      .then((data) => {
        const filePath = path.join(
          path.resolve("./"),
          "./uploads",
          data[0].image.split("/").pop()
        );
        try {
          console.log(filePath);
          fs.unlinkSync(filePath);
          console.log("Delete File successfully.");
        } catch (error) {
          console.log(error);
        }
      })
      .catch((fail) => {
        console.log(fail);
        if (fail) {
          if (fail.name === "MongoServerError" && fail.code === 11000) {
            if (fail.keyValue.farm_name) {
              return res.status(409).send({
                succes: false,
                message: "farm_name already exist!",
              });
            } else {
              return res.status(500).send({
                succes: false,
                message: "Something went to wrong",
                error: fail.message,
              });
            }
          } else {
            return res.status(500).send({
              succes: false,
              message: "Something went to wrong",
              error: fail.message,
            });
          }
        }
      });
    await FarmModel.findOneAndRemove({ _id: req.body.id })
      .then(async () => {
        return res.status(200).send({
          status: true,
          message: "Farm deleted successfully",
        });
      })
      .catch((fail) => {
        console.log(fail);
        if (fail) {
          if (fail.name === "MongoServerError" && fail.code === 11000) {
            if (fail.keyValue.farm_name) {
              return res.status(409).send({
                succes: false,
                message: "farm_name already exist!",
              });
            } else {
              return res.status(500).send({
                succes: false,
                message: "Something went to wrong",
                error: fail.message,
              });
            }
          } else {
            return res.status(500).send({
              succes: false,
              message: "Something went to wrong",
              error: fail.message,
            });
          }
        }
      });
  }
});

app.get("/get", async (req, res) => {
  await FarmModel.find()
    .exec()
    .then(async (data) => {
      return res.status(200).send({
        status: true,
        message: "Farm Fetched",
        data: data,
      });
    })
    .catch((fail) => {
      console.log(fail);
      if (fail) {
        if (fail.name === "MongoServerError" && fail.code === 11000) {
          if (fail.keyValue.farm_name) {
            return res.status(409).send({
              succes: false,
              message: "farm_name already exist!",
            });
          } else {
            return res.status(500).send({
              succes: false,
              message: "Something went to wrong",
              error: fail.message,
            });
          }
        } else {
          return res.status(500).send({
            succes: false,
            message: "Something went to wrong",
            error: fail.message,
          });
        }
      }
    });
});

module.exports = app;
