const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
require("dotenv").config();

const auth = async (req, res, next) => {
  const token = req.params.token;
  if (!token) {
    const error = new Error("no token");
    error.status = 401;
    next(error);
    return;
  }

  const decode = await jwt.verify(token, process.env.TOKEN_SECRET);

  const user = await User.findById(decode);
  if (!user) {
    const error = new Error("you are not authorized for to perfom this action");
    error.status = 401;
    next(error);
  }
  next();
};

module.exports = auth;
