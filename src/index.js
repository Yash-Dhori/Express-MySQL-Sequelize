const express = require("express");
require("dotenv").config();
const { sequelize } = require("./utils");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET", "POST", "PUT", "DELETE");
  next();
});

app.use(require("./routes/index"));

app.use((err, req, res, next) => {
  console.error("Error middleware:", err.message);
  res.status(500).json({ error: "Internal Server Error" });
});

(async () => {
  try {
    const port = process.env.PORT || 4000;
    await sequelize.sync({ force: false });
    app.listen(port, () => console.log(`Server is listening on port: ${port}`));
  } catch (error) {
    console.log("Error while listening to the server", error);
  }
})();
