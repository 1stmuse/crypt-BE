const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
require("dotenv").config();

const auth = async (req, res, next) => {
  const bearer = req.headers["authorization"];
  if (typeof bearer === "undefined") {
    const error = new Error("please provide an authorization token");
    error.status = 401;
    next(error);
  }

  const token = bearer.split(" ")[1];

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
