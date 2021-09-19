const Router = require("express").Router();
const { register, login } = require("../controllers");
const auth = require("../middleWares/auth");

Router.post("/user/register", register);
Router.post("/user/login", login);

module.exports = Router;
