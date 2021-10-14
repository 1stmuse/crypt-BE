const Router = require("express").Router();
const {
  register,
  login,
  getInfo,
  addInfo,
  getUsers,
  getDebtBalance,
} = require("../controllers/userControler");
const {
  createTransaction,
  getTransaction,
  getUserTransactions,
  getAllTransactions,
  editTransaction,
} = require("../controllers/transactionsController");
const { auth, admin } = require("../middlewares");

Router.get("/users", auth, admin, getUsers);
Router.get("/admin/info", auth, getInfo);
Router.post("/admin/info", auth, admin, addInfo);
Router.post("/user/register", register);
Router.post("/user/login", login);
Router.get("/user/debt", auth, getDebtBalance);
Router.post("/transactions", auth, createTransaction);
Router.get("/transactions/:userId", auth, getUserTransactions);
Router.get("/transaction/:transactionId", auth, getTransaction);
Router.put("/transaction/:transactionId", auth, admin, editTransaction);
Router.get("/transactions", auth, admin, getAllTransactions);

module.exports = Router;
