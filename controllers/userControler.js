const User = require("../models/user.model");
const AdminInfo = require("../models/adminInfo");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require("dotenv").config();

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
    const user = await User.findOne({ email: payload.email });
    if (user) {
      const error = new Error("email already exist");
      error.status = 400;
      next(error);
      return;
    }
    const hashPassword = await bcrypt.hash(payload.password, 10);
    payload.password = hashPassword;

    let newUser = new User(payload);
    await newUser.save();
    res
      .status(200)
      .json({ error: false, message: "user created successfully" });
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
