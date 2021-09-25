const User = require("../models/user.model");
const Transaction = require("../models/transaction");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require("dotenv").config();

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

exports.getTransactions = async (req, res, next) => {
  const { userId } = req.params;
  try {
    if (!mongoose.isValidObjectId(userId)) {
      const error = new Error("invalid user id");
      error.status = 400;
      next(error);
      return;
    }
    const transactions = await Transaction.find({ userId }).sort({
      createdAt: -1,
    });
    if (!transactions) {
      const error = new Error("transactions do not exist");
      err.status(404);
      next(error);
      return;
    }

    res.status(200).json({
      error: false,
      data: {
        transactions,
      },
    });
  } catch (err) {
    const error = new Error(err.message);
    error.status = 400;
    next(error);
  }
};

exports.getTransaction = async (req, res, next) => {
  const { transactionId } = req.params;
  try {
    if (!mongoose.isValidObjectId(transactionId)) {
      const error = new Error("invalid transaction Id");
      error.status = 400;
      next(error);
      return;
    }
    const transaction = await Transaction.findById(transactionId);

    if (!transaction) {
      const error = new Error("transaction does not exist");
      error.status = 404;
      next(error);
      return;
    }

    res.status(200).json({
      error: false,
      data: {
        transaction,
      },
    });
  } catch (err) {
    const error = new Error(err.message);
    error.status = 400;
    next(error);
  }
};

exports.createTransaction = async (req, res, next) => {
  // const { userId, type, status } = req.body;
  try {
    // const data = {
    //   userId,
    //   type,
    //   status,
    // };

    let trans = await new Transaction(req.body);
    await trans.save();
    if (!trans) {
      const error = new Error("failed to create transaction");
      error.status = 400;
      next(error);
      return;
    }
    res.status(200).json({
      error: false,
      message: "transaction added",
    });
  } catch (err) {
    const error = new Error(err.message);
    error.status = 400;
    next(error);
  }
};

exports.editTransaction = async (req, res, next) => {
  const { id, status } = req.body;
  try {
    let trans = await Transaction.findById(id);
    trans.status = status;
    await trans.save();
    if (!trans) {
      const error = new Error("failed to edit transaction");
      error.status = 400;
      next(error);
      return;
    }
  } catch (err) {
    const error = new Error(err.message);
    error.status = 400;
    next(error);
  }
};
