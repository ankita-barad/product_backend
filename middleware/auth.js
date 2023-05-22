const jwt = require("jsonwebtoken");
const { BlacklistModel } = require("../model/blacklist");
const auth = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    res.status(400).send("unauthorized access");
  }
  const blacklisted = await BlacklistModel.find({ token });

  if (blacklisted) {
    res.status(400).send("unauthorized access");
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded) {
    res.status(400).send("unauthorized access");
  }
  req.user = decoded.user;
  next();
};

module.exports = { auth };
