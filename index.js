const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const Auth = require("./Routes/authentication");
require("dotenv").config();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Check .env file for MongoDB database user and password name
const mongoUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.pwqsejd.mongodb.net/E-Shop?retryWrites=true&w=majority`;

// Conntct with MongoDB
console.log(mongoUrl);

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connceted to MongoDB Successful");
  })
  .catch((error) => console.log("Database Connection Error", error));

//   Use Router
app.use("/auth", Auth);

// Testing
app.get("/", (req, res) => {
  res.send("Backend Server Is Running");
});

app.listen(port, () => {
  console.log("Backend Server Is Running http://localhost:5000");
});
