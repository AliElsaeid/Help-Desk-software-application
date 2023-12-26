const express = require("express");
const app = express();
const mongoose = require("mongoose");
require('dotenv').config();
const cors = require("cors");
const cookieParser = require('cookie-parser');
const authenticationMiddleware = require('./Middleware/authenticationMiddleware');




// console.log(process.env.ORIGIN);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Configure CORS
app.use(
  cors({
    origin: process.env.ORIGIN, // Ensure the ORIGIN environment variable is set in your .env file
    credentials: true, // This is important for cookies or auth headers
  })
);

// Router setup
const user = require('./Routes/userRoutes');

const ticketsRoutes = require('./Routes/ticketRoutes');
const communicationRoutes = require('./Routes/communicationRoutes');
const appearance = require('./Routes/AppearanceRoutes');
const report = require('./Routes/reportRoutes');
const articles =require('./Routes/articleRoutes')


// Use routers
app.use("/api/v1/user", user);

app.use(authenticationMiddleware);
app.use("/api/v1/ticket",ticketsRoutes);
app.use("/api/v1/communication", communicationRoutes);
app.use("/api/v1/appearance", appearance);
app.use("/api/v1/report", report);
app.use("/api/v1/article",articles);

// DB connection
const db_url = process.env.ATLAS_URI; // Make sure to add ATLAS_URI to your .env file

// Updated dbOptions for Atlas connection
const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

mongoose
  .connect(db_url, dbOptions)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((e) => {
    console.error("MongoDB Atlas connection error:", e.message);
  });
// Handle 404
app.use(function (req, res, next) {
  return res.status(404).send("404 - Not Found");
});


// Start server
app.listen(3000, () => console.log("Server started on port 3000"));