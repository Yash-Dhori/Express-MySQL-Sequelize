const validateToken = require("./validateTokenHandler.middleware");
const errorHandler = require("./errorHandler.middleware");

module.exports = {
  validateToken,
  errorHandler,
};
