const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://Fabrice:Fabrice12@cluster0.bnhnfjq.mongodb.net/review_app?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("DB is connected");
  })
  .catch((ex) => {
    console.log("DB connection failed: ", ex);
  });
