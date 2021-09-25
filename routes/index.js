const Router = require("express").Router();
const {
  register,
  login,
  getTransaction,
  getTransactions,
  createTransaction,
} = require("../controllers");
const auth = require("../middlewares/auth");

Router.post("/user/register", register);
Router.post("/user/login", login);
Router.post("/transactions", auth, createTransaction);
Router.get("/transactions/:userId", auth, getTransactions);
Router.get("/transaction/:transactionId", auth, getTransaction);

module.exports = Router;
