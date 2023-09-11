const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    console.log("DB is connected");
  })
  .catch((ex) => {
    console.log("DB connection failed: ", ex);
  });
