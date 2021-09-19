const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const TransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      ref: "user",
      required: true,
    },
    status: {
      type: String,
      require: true,
      default: "unresolved",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("transaction", TransactionSchema);
