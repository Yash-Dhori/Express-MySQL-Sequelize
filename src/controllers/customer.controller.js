const { customerService } = require("../services");

const getCustomer = async (req, res) => {
  await customerService.getCustomer(req, res);
};

const createCustomer = async (req, res) => {
  await customerService.createCustomer(req, res);
};

const updateCustomer = async (req, res) => {
  await customerService.updateCustomer(req, res);
};

module.exports = {
  getCustomer,
  createCustomer,
  updateCustomer,
};
