const mongoose = require("mongoose");

mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    console.log("DB is connected");
  })
  .catch((ex) => {
    console.log("DB connection failed: ", ex);
  });
