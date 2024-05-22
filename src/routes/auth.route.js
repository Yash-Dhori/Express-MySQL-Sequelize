const routes = require("express").Router();
const { authController } = require("../controllers");
const { validateToken } = require("../middleware");

routes.post("/login", authController.userLogin);
routes.post(
  "/changePassword",
  validateToken,
  authController.userChangePassword
);

module.exports = routes;
