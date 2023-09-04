const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("<h1>hello from backend</h1>");
});
app.listen(8000, () => {
  console.log("the app is listening on port 8000");
});
