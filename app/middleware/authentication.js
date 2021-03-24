
const jwt = require("jsonwebtoken");
const config = require("../../api/config/config.js");
const User = require('../../app/module/users/models/users.model.js');
module.exports = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401).send({
      message: "Unauthorized"
    });
  }

  try {
    const decoded = jwt.verify(token, config.secret);
    const user = User.findById(decoded.sub);
    const user_from_token = await user;
    req.user = user_from_token;
    next();
  } catch (ex) {
    res.status(401).send({
      message: "Unauthorized"
    });
  }
};