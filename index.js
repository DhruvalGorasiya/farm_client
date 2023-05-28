const express = require("express");
const app = express();
require("./configs/db_connect");
const bodyParser = require("body-parser");
const path = require("node:path");
const Farm = require("./api/farma");
const cors = require("cors");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
// app.set("view engine", "ejs");

// app.get("/", (req, res) => {
//   res.render("index");
// });

app.use("/uploads", express.static("uploads"));
app.use("/api/farm", Farm);

app.listen(3000, (error) => {
  if (error) {
    console.log(`${error}  some error is found`);
  } else {
    console.log("server connected with port 3000");
  }
});
