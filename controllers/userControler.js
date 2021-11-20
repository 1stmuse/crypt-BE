const User = require("../models/user.model");
const AdminInfo = require("../models/adminInfo");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require("dotenv").config();
const emailValidator = require("deep-email-validator");
const { verifyMail } = require("../utils/verifyMail");
const transport = require("../utils/mailer");

async function isEmailValid(email) {
  return emailValidator.validate(email);
}

exports.getUsers = async (req, res, next) => {
  try {
    let users = await User.find({ isAdmin: false });
    res.status(200).json({
      error: false,
      data: {
        users,
      },
      message: "successfully found users",
    });
  } catch (err) {}
};

exports.getDebtBalance = async (req, res, next) => {
  const { debt } = req.user;
  if (!debt) {
    const error = new Error("could not get debt balance");
    error.status = 401;
    next(error);
    return;
  }
  res.status(200).json({
    error: false,
    data: {
      debt,
    },
    message: "successfully found users",
  });
};

exports.addInfo = async (req, res, next) => {
  try {
    let info = new AdminInfo(req.body);
    info = await info.save();
    if (!info) {
      const error = new Error("could not create info");
      error.status = 401;
      next(error);
      return;
    }

    res.status(200).json({
      error: false,
      message: "created successfully",
    });
  } catch (err) {
    const error = new Error(err.message);
    error.status = 401;
    next(error);
  }
};

exports.getInfo = async (req, res, next) => {
  try {
    let info = await AdminInfo.find().sort({ createdAt: -1 });
    if (!info) {
      const error = new Error("could not create info");
      error.status = 401;
      next(error);
      return;
    }

    res.status(200).json({
      error: false,
      message: "created successfully",
      data: {
        info: info[0],
      },
    });
  } catch (err) {
    const error = new Error(err.message);
    error.status = 401;
    next(error);
  }
};

exports.register = async (req, res, next) => {
  try {
    const payload = req.body;

    const { valid, reason, validators } = await isEmailValid(payload.email);
    // console.log(valid, reason, validators);

    if (!validators.mx.valid) {
      const error = new Error("email is not a valid email address");
      error.status = 400;
      next(error);
      return;
    }

    const user = await User.findOne({ email: payload.email });
    if (user) {
      const error = new Error("email already exist");
      error.status = 400;
      next(error);
      return;
    }
    const hashPassword = await bcrypt.hash(payload.password, 10);
    payload.password = hashPassword;

    const url = `http://localhost:3000/verify/${payload.email}`;

    let newUser = new User(payload);
    await newUser.save();
    const mailOptions = {
      from: "contact.security@cryptwaviloan.com", // Sender address
      to: payload.email, // List of recipients
      subject: "Verify Your Email", // Subject line
    };

    transport.sendMail(
      {
        ...mailOptions,
        html: verifyMail(url),
      },
      (err, info) => {
        if (err) {
          const error = new Error("verification link not sent");
          error.status = 400;
          next(error);
          // return;
          console.log(err);
        } else {
          console.log("success", info);
          res.status(200).json({
            error: false,
            message: "A verification link has been sent to your email address",
            data: url,
          });
        }
      }
    );

    // res.status(200).json({
    //   error: false,
    //   message: "A verification link has been sent to your email address",
    //   data: url,
    // });
  } catch (err) {
    const error = new Error(err.message);
    error.status = 400;
    next(error);
  }
};

exports.verifyEmail = async (req, res, next) => {
  const email = req.body.email;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error("email does not exist");
      error.status = 400;
      next(error);
      return;
    }

    user.isVerified = true;
    await user.save();
    res.status(200).json({
      error: false,
      message: "Email verification successful",
    });
  } catch (err) {
    const error = new Error(err.message);
    error.status = 400;
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const payload = req.body;
  try {
    const user = await User.findOne({ email: payload.email });

    if (!user.isVerified && !user.isAdmin) {
      const error = new Error("Please verify your email address to continue");
      error.status = 400;
      next(error);
      return;
    }

    if (!user) {
      const error = new Error("username or password incorrect");
      error.status = 400;
      next(error);
      return;
    }

    const password = bcrypt.compareSync(payload.password, user.password);
    if (!password) {
      const error = new Error("username or password incorrect");
      error.status = 400;
      next(error);
      return;
    }
    const token = jwt.sign(user._id.toHexString(), process.env.TOKEN_SECRET);
    if (!token) {
      const error = new Error("could not generate token");
      error.status = 500;
      next(error);
      return;
    }
    res.status(200).json({
      error: false,
      data: {
        token,
        user,
      },
      message: "login succesfull",
    });
  } catch (err) {
    const error = new Error(err.message);
    error.status = 400;
    next(error);
  }
};
