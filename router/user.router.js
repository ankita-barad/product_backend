const express = require("express");

const { UserModel } = require("../model/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { BlacklistModel } = require("../model/blacklist");
const userRoute = express.Router();

userRoute.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    bcrypt.hash(password, 10, async (err, hash) => {
      const newUser = await new UserModel({
        name,
        email,
        password: hash,
        role,
      });
      newUser.save();
      res.status(200).send("User registerd successfully");
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

userRoute.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(400).send("unauthorized user");
    }
    bcrypt.compare(password, user.password, function (err, result) {
      if (!result) {
        res.status(400).send("unauthorized user");
      }

      const token = jwt.sign({ user: user }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      const refreshToken = jwt.sign({ user: user }, process.env.REF_SECRET, {
        expiresIn: "7d",
      });
      res.status(200).send({ token: token, refreshToken: refreshToken });
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

userRoute.post("/logout", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const blackListToken = await new BlacklistModel({ token });
    blackListToken.save();
    res.status(200).send("logged out successfully");
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = { userRoute };
