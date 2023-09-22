const express = require("express");
require("express-async-errors");
const userRouter = require("./routes/user");
const morgan = require("morgan");
const dotenv = require("dotenv");
const { errorHandler } = require("./middlewares/error");
dotenv.config({ path: "./config.env" });
require("./db");

const app = express();
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/user", userRouter);
app.use(errorHandler);

app.listen(8000, () => {
  console.log("the app is listening on port 8000");
});
