const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

const validateToken = asyncHandler(async (req, res, next) => {
  let token;
  let authHeader = req.headers.Authorization || req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, async (error, decoded) => {
      if (error) {
        res.status(401).send({
          message: "User is not Authorized!",
        });
        return;
      }

      const email = decoded.email;
      const validUser = await User.findOne({
        where: { email: email, token: token },
      });

      if (!validUser) {
        res.status(401).send({
          message: "Invalid token!",
        });
        return;
      }

      req.user = decoded;
      next();
    });

    if (!token) {
      res.status(401).send({
        message: "User is not Authorized or Token is Missing!",
      });
      return;
    }
  } else {
    res.status(401).send({
      message: "User is not Authorized or Token is Missing!",
    });
    return;
  }
});

module.exports = validateToken;
