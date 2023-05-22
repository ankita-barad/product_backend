const { UserModel } = require("../model/user.model");

const jwt = require("jsonwebtoken");
const { BlacklistModel } = require("../model/blacklist");
function checkRole(role) {
  return async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    console.log(token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    if (!role.includes(decoded.user.role)) {
      res.status(400).send("unauthorized access");
    }
  };
  next();
}

module.exports = { checkRole };
