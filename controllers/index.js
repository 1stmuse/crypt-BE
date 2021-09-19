const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.register = async (req, res, next) => {
  try {
    const payload = req.body;
    const user = await User.findOne({ email: payload.email });
    if (user) {
      const error = new Error("email already exist");
      error.status = 401;
      next(error);
    }

    const hashPassword = await bcrypt.hash(payload.password, 10);
    payload.password = hashPassword;

    let newUser = new User(payload);
    await newUser.save();
    res.status(200).json({ error: false });
  } catch (err) {
    const error = new Error(err.message);
    error.status = 401;
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const payload = req.bcrypt;
  try {
    const user = await User.findOne({ username: payload.email });
    if (!user) {
      const error = new Error("username or password incorrect");
      error.status = 401;
      next(error);
      return;
    }

    const password = bcrypt.compareSync(payload.password, user.password);
    if (!password) {
      const error = new Error("username or password incorrect");
      error.status = 401;
      next(error);
      return;
    }
    const token = jwt.sign(user._id.toHexString(), process.env.TOKEN_SECRET);
    if (!token) {
      const error = new Error("could not generate token");
      error.status = 401;
      next(error);
    }
    res
      .cookie("auth", token)
      .status(200)
      .json({ error: false, token, user: user, message: "login succesfull" });
  } catch (err) {
    const error = new Error(err.message);
    error.status = 401;
    next(error);
  }
};
