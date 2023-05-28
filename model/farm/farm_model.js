const mongooes = require("mongoose");

const FarmSchema = mongooes.Schema(
  {
    farm_name: { type: String, require: true, unique: true },
    image: { type: String, require: true },
  },
  {
    collection: "farm_collaction",
    versionKey: false,
    timestamps: true,
    toObject: {
      transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret.password;
        return ret;
      },
    },
  }
);

const farmModel = mongooes.model("FarmSchema", FarmSchema);

module.exports = farmModel;
