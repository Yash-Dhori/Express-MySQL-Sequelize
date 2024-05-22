const axios = require("axios");
const { Customer } = require("../models");
const PINCODE_URL = "https://api.postalpincode.in/pincode";

const getCustomer = async (req, res) => {
  try {
    const id = req.params.id;
    const customer = await Customer.findByPk(id);

    if (!customer) {
      res.status(404).send({
        message: `Customer with ID: ${id} not found`,
      });
      return;
    }

    res.status(200).send(customer);
    return;
  } catch (error) {
    res.status(500).send({
      message: "Server error while while saving upcoming sports",
      error,
    });
    return;
  }
};

const createCustomer = async (req, res) => {
  try {
    const { fullName, mobileNumber, birthDate, gender, addressDetails } =
      req.body;
    if (fullName.length >= 32 || !/^[a-zA-Zs]+$/.test(fullName)) {
      res.status(400).send({
        message:
          "Full name should be less than 32 characters and does not contain any number",
      });
      return;
    }

    if (String(mobileNumber).length !== 10 || !/^[0-9]+$/.test(mobileNumber)) {
      res.status(400).send({
        message:
          "Mobile number should be 10 digit long and does not contain any alphabets",
      });
      return;
    }

    if (!(gender === 1 || gender === 2)) {
      res.status(400).send({
        message: "Gender should be either 1 or 2 (1 for male & 2 for female)",
      });
      return;
    }

    if (birthDate) {
      const [day, month, year] = birthDate.split("-").map(Number);
      const date = new Date(year, month - 1, day);
      if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
      ) {
        return false;
      }

      if (date > new Date()) {
        res.status(400).send({
          message: "Future date is not a valid birth date",
        });
        return;
      }
    }

    if (!Array.isArray(addressDetails) && !addressDetails.length) {
      res.status(400).send({
        message: "Please pass at least 1 address detail",
      });
      return;
    }

    if (Array.isArray(addressDetails) && addressDetails.length) {
      for (let i = 0; i < addressDetails.length; i++) {
        const { address, landmark, pincode } = addressDetails[i];
        if (address.length >= 124) {
          res.status(400).send({
            message: "Address length should be less than 124 characters",
          });
          return;
        } else if (landmark.length >= 64) {
          res.status(400).send({
            message: "Landmark length should be less than 64 characters",
          });
          return;
        } else if (String(pincode).length !== 6) {
          res.status(400).send({
            message: "Pincode length should be 6 digits",
          });
          return;
        }
      }
    }

    // Fetching address from postapicode
    const updatedAddressDetails = await Promise.all(
      addressDetails.map(async ({ address, landmark, pincode }) => {
        const { data } = await axios.get(`${PINCODE_URL}/${pincode}`);
        if (data[0].PostOffice == null) {
          return {
            address,
            landmark,
            pincode: Number(pincode),
          };
        }
        const { Country, State, Name, District } = data[0].PostOffice.at(-1);
        return {
          address,
          landmark,
          pincode: Number(pincode),
          postOfficeName: Name,
          district: District,
          state: State,
          country: Country,
        };
      })
    );

    const saveCustomer = await Customer.create({
      fullName: fullName,
      mobileNumber: String(mobileNumber),
      birthDate: birthDate,
      gender: gender,
      address: updatedAddressDetails,
    });

    res.status(201).send({
      message: "Customer created successfully.",
      data: saveCustomer,
    });
    return;
  } catch (error) {
    res.status(500).send({
      message: "Server error while while saving upcoming events",
      error,
    });
    return;
  }
};

const updateCustomer = async (req, res) => {
  try {
    const id = req.params.id;
    const customer = await Customer.findByPk(id);

    if (!customer) {
      res.status(404).send({
        message: `Customer with ID: ${id} not found`,
      });
      return;
    }

    const { fullName, mobileNumber, birthDate, gender, addressDetails } =
      req.body;
    if (fullName && (fullName.length >= 32 || !/^[a-zA-Zs]+$/.test(fullName))) {
      res.status(400).send({
        message:
          "Full name should be less than 32 characters and does not contain any number",
      });
      return;
    }

    if (
      mobileNumber &&
      (String(mobileNumber).length !== 10 || !/^[0-9]+$/.test(mobileNumber))
    ) {
      res.status(400).send({
        message:
          "Mobile number should be 10 digit long and does not contain any alphabets",
      });
      return;
    }

    if (gender && !(gender === 1 || gender === 2)) {
      res.status(400).send({
        message: "Gender should be either 1 or 2 (1 for male & 2 for female)",
      });
      return;
    }

    if (birthDate) {
      const [day, month, year] = birthDate.split("-").map(Number);
      const date = new Date(year, month - 1, day);
      if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
      ) {
        return false;
      }

      if (date > new Date()) {
        res.status(400).send({
          message: "Future date is not a valid birth date",
        });
        return;
      }
    }
    let updatedAddressDetails;

    if (addressDetails) {
      if (!Array.isArray(addressDetails) && !addressDetails.length) {
        res.status(400).send({
          message: "Please pass at least 1 address detail",
        });
        return;
      }

      if (Array.isArray(addressDetails) && addressDetails.length) {
        for (let i = 0; i < addressDetails.length; i++) {
          const { address, landmark, pincode } = addressDetails[i];
          if (address.length >= 124) {
            res.status(400).send({
              message: "Address length should be less than 124 characters",
            });
            return;
          } else if (landmark.length >= 64) {
            res.status(400).send({
              message: "Landmark length should be less than 64 characters",
            });
            return;
          } else if (String(pincode).length !== 6) {
            res.status(400).send({
              message: "Pincode length should be 6 digits",
            });
            return;
          }
        }
      }

      // Fetching address from postapicode
      updatedAddressDetails = await Promise.all(
        addressDetails.map(async ({ address, landmark, pincode }) => {
          const { data } = await axios.get(`${PINCODE_URL}/${pincode}`);
          if (data[0].PostOffice == null) {
            return {
              address,
              landmark,
              pincode: Number(pincode),
            };
          }
          const { Country, State, Name, District } = data[0].PostOffice.at(-1);
          return {
            address,
            landmark,
            pincode: Number(pincode),
            postOfficeName: Name,
            district: District,
            state: State,
            country: Country,
          };
        })
      );
    }

    const updateCustomer = await Customer.update(
      {
        fullName: fullName ? fullName : customer.dataValues.fullName,
        mobileNumber: mobileNumber
          ? String(mobileNumber)
          : customer.dataValues.mobileNumber,
        birthDate: birthDate ? birthDate : customer.dataValues.birthDate,
        gender: String(gender) ? gender : customer.dataValues.gender,
        address:
          addressDetails && addressDetails.length
            ? updatedAddressDetails
            : customer.dataValues.address,
      },
      { where: { id: id } }
    );

    let customerData;
    if (updateCustomer.length) {
      customerData = await Customer.findByPk(id);
    }

    res.status(200).send({
      message: "Customer updated successfully",
      data: customerData,
    });
    return;
  } catch (error) {
    console.log("Error", error);
    res.status(500).send({
      message: "Server error while while saving upcoming events",
      error,
    });
    return;
  }
};

module.exports = {
  getCustomer,
  createCustomer,
  updateCustomer,
};
