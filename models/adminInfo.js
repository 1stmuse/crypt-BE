const mongoose = require("mongoose");

const AdminInfo = new mongoose.Schema(
  {
    bank_name: {
      type: String,
      required: true,
    },
    bank_number: {
      type: String,
      required: true,
    },
    btc_address: {
      type: String,
      require: true,
    },
    ethereum_address: {
      type: String,
      required: true,
    },
    dogecoin_address: {
      type: String,
      required: true,
    },
    litecoin_address: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("admin", AdminInfo);
