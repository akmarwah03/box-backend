const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cors = require("cors");

const authRouter = require("./routes/auth");

const app = express();
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use("/auth", authRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
