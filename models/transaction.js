const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const TransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      ref: "user",
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      require: true,
      default: "pending",
    },
    cash_amount: {
      type: String,
      required: true,
    },
    btc_amount: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    accepted: {
      type: Boolean,
      default: false,
    },
    crypto_type: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("transaction", TransactionSchema);
