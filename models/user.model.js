const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      required: true,
    },
    debt: {
      type: String,
      default: "0",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    auth: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      default: "",
    },
    otp_expires: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

UserSchema.methods.createOtp = function (otp) {
  var user = this;

  const today = new Date();
  const future = today.getMinutes();
  user.otp = otp;
  user.otp_expires = future;
  user.save();
};

module.exports = mongoose.model("user", UserSchema);
