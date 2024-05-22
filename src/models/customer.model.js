const { DataTypes } = require("sequelize");
const { sequelize: db } = require("../utils/index");

const Customer = db.define("customers", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [1, 32],
        msg: "fullName must be at least 32 characters long",
      },
      noNumbers(value) {
        if (/\d/.test(value)) {
          throw new Error("fullName cannot contain numbers");
        }
      },
    },
  },
  mobileNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isNumeric: {
        msg: "mobileNumber must contain only digits",
      },
      len: {
        args: [10, 10],
        msg: "mobileNumber must be exactly 10 digits long",
      },
    },
  },
  birthDate: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: {
        msg: "Invalid date format",
      },
      notFutureDate(value) {
        const currentDate = new Date();
        if (new Date(value) > currentDate) {
          throw new Error("Birth date cannot be a future date");
        }
      },
    },
  },
  gender: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isIn: [[1, 2]], // Ensure the value is either 1 or 2
      isInt: true, // Ensure it's an integer
    },
  },
  address: {
    type: DataTypes.JSON,
    allowNull: false,
  },
});

module.exports = Customer;
