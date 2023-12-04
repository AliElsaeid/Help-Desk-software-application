const express = require("express");
const app = express();
const mongoose = require("mongoose");
require('dotenv').config();
const url = require('url');
app.use(express.json());



const communicationRoutes = require('./Routes/communicationRoutes');



app.use("/api/v1/communication", communicationRoutes);

const user= require('./Routes/userRoutes');
const appearance=require('./Routes/AppearanceRoutes');
app.use("/api/v1/appearance", appearance);


app.use("/api/v1/user", user);


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next()
});




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
