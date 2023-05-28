const mongoDB =
  "mongodb+srv://dhruvalgorasiya1234:farm%40123@cluster0.ewritxv.mongodb.net/farm";
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const connectDB = mongoose
  .connect(mongoDB)
  .catch((error) => console.log("mongoDB connection error" + error))
  .then(console.log("mongoDB Connected"));

module.exports = connectDB;
