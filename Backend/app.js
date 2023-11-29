const express = require("express");
const app = express();
const mongoose = require("mongoose");
require('dotenv').config();
const url = require('url');
const usersRoutes = require("./Routes/userRoutes");




app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next()
});



app.use("/api/v1/users", usersRoutes);

const db_name = "Help_Desk";

const db_url = `mongodb://127.0.0.1:27017/${db_name}`;

const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose
  .connect(db_url, dbOptions)
  .then(() => console.log("MongoDB connected"))
  .catch((e) => {
    console.error("MongoDB connection error:", e.message);
  });

app.use(function (req, res, next) {
  return res.status(404).send("404");
});
app.listen(3000, () => console.log("server started"));
