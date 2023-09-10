const express = require("express");
const { create } = require("../controllers/user");
const { userValidator } = require("../middlewares/validator");
const { validate } = require("../middlewares/validator");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("<h1>hello from backend</h1>");
});
router.post("/create", userValidator, validate, create);

module.exports = router;
