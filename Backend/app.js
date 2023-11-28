const express = require("express");
const app = express();
const mongoose = require("mongoose");
require('dotenv').config();
const url = require('url');




app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next()
});




const mongoUrl = url.parse(process.env.MONGO_URI);
const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: mongoUrl.pathname.replace(/^\//, ''), // Extracts the database name from the pathname
};

mongoose
  .connect(process.env.MONGO_URI, dbOptions)
  .then(() => console.log("MongoDB connected"))
  .catch((e) => {
    console.error("MongoDB connection error:", e.message);
  });

app.use(function (req, res, next) {
  return res.status(404).send("404");
});
app.listen(3000, () => console.log("server started"));
