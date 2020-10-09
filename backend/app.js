const express = require("express");
const bodyParser = require("body-parser");
const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");
const mongoose = require("mongoose");
const app = express();

app.use(bodyParser.json());

app.use("/api/places", placesRoutes);

app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  throw new HttpError("Could not find this route", 404);
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured!" });
});

mongoose
  .connect(
    "mongodb+srv://erwinRare:987654321@cluster0.yc88o.mongodb.net/places?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(8000);
  })
  .catch((err) => {
    console.log(err);
  });
