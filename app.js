const express = require("express");
const app = express();
const cors = require("cors");
const cookie = require("cookie-parser");
const routes = require("./routes");

app.use(cors());
app.use(cookie());
app.use(express.json());

app.use("/api", routes);

app.use((req, res, next) => {
  const error = new Error("Resource not found");
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: true,
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
