const router = require("express").Router();

// Import routes
const authRoute = require("./auth.route");
const customerRoute = require("./customer.route");

// Use routes
router.use("/auth", authRoute);
router.use("/customer", customerRoute);

module.exports = router;
