const express = require("express");
const userRouter = require("./routes/user");
require("./db");
const app = express();
app.use(express.json());

app.use("/api/user", userRouter);

app.listen(8000, () => {
  console.log("the app is listening on port 8000");
});
