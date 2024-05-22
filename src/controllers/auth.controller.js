const { authService } = require("../services");

const userLogin = async (req, res) => {
  await authService.userLogin(req, res);
};

const userChangePassword = async (req, res) => {
  await authService.userChangePassword(req, res);
};

module.exports = {
  userLogin,
  userChangePassword,
};
