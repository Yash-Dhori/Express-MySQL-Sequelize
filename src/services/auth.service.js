var jwt = require("jsonwebtoken");
const { User } = require("../models");

const userLogin = async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      res.status(404).send({
        message: "Email & Password is required",
      });
      return;
    }
    const { email, password } = req.body;

    const validUser = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!validUser) {
      res.status(404).send({
        message: "User does not exists!",
      });
      return;
    }

    if (validUser.dataValues.password !== password) {
      res.status(404).send({
        message: "Incorrect password!",
      });
      return;
    }

    // Generating and updating an access_token
    const access_token = jwt.sign({ email: email }, process.env.JWT_SECRET);
    await User.update({ token: access_token }, { where: { email: email } });

    res.status(200).send({
      email,
      access_token,
    });
    return;
  } catch (error) {
    res.status(500).send({
      message: "Server error while while saving upcoming sports",
      error,
    });
    return;
  }
};

const userChangePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const { email } = req.user;

    if (oldPassword.length < 8 || newPassword.length < 8) {
      res.status(400).send({
        message: "Password length should be more than 8 characters",
      });
      return;
    }

    const validUser = await User.findOne({
      where: {
        email: email,
        password: oldPassword,
      },
    });

    if (!validUser) {
      res.status(404).send({
        message: "User does not exists!",
      });
      return;
    }

    // Generating and updating an access_token
    const access_token = jwt.sign({ email: email }, process.env.JWT_SECRET);
    await User.update(
      { password: newPassword, token: access_token },
      { where: { email: email } }
    );

    res.status(200).send({
      email,
      access_token,
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

module.exports = {
  userLogin,
  userChangePassword,
};
