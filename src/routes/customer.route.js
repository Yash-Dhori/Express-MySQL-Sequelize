const routes = require("express").Router();
const { customerController } = require("../controllers");
const { validateToken } = require("../middleware");

routes.use(validateToken);
routes.get("/:id", customerController.getCustomer);
routes.post("/", customerController.createCustomer);
routes.patch("/:id", customerController.updateCustomer);

module.exports = routes;
