const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Auth = express.Router();
const UserModel = require("../Schema/users");
require("dotenv").config();

Auth.get("/", (req, res) => {
  res.send("Authentication Router Is Running");
});

// this is sign up api
Auth.post("/signup", async (req, res) => {
  try {
    const { email } = req.body;
    const existingUser = await UserModel.findOne({ email }).exec();

    if (existingUser) {
      return res.send({ message: "Email Already Registered", alert: false });
    } else {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = await new UserModel({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        image: req.body.image,
        email: req.body.email,
        password: hashedPassword,
      }).save();
      res.send({
        message: "Signup Was Successfull",
        user: newUser,
        alert: true,
      });
    }
  } catch (error) {
    console.log(error);
    res.send({ message: "Signup Failed" });
  }
});

// this is login api
Auth.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await UserModel.findOne({ email }).exec();
    if (existingUser) {
      const isValidPassword = await bcrypt.compare(
        req.body.password,
        existingUser.password
      );
      if (isValidPassword) {
        const token = jwt.sign(
          {
            userName: existingUser.firstName + " " + existingUser.lastName,
            userID: existingUser._id,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h",
          }
        );

        res.send({
          message: "Login Successful",
          user: existingUser,
          access_token: token,
        });
      } else {
        res.send({ message: "Password Incorrect" });
      }
    } else {
      res.send({ message: "Email Invalid" });
    }
  } catch (error) {
    res.send({ message: "Authentication Failed" });
  }
});

module.exports = Auth;
