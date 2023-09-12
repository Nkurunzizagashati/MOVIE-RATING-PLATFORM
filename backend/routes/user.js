const express = require("express");
const {
  create,
  verifyEmail,
  resendEmailVerificationToken,
  forgetPassword,
  sendPasswordResetTokenStatus,
  resetPassword,
  SignIn,
} = require("../controllers/user");
const {
  userValidator,
  validatePassword,
  signInValidator,
} = require("../middlewares/validator");
const { validate } = require("../middlewares/validator");
const { isValidPassResetToken } = require("../middlewares/user");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("<h1>hello from backend</h1>");
});
router.post("/create", userValidator, validate, create);
router.post("/sign-in", signInValidator, validate, SignIn);
router.post("/verify-email", verifyEmail);
router.post("/resend-email-verification-token", resendEmailVerificationToken);

router.post("/forget-password", forgetPassword);
router.post(
  "/verify-pass-reset-token",
  isValidPassResetToken,
  sendPasswordResetTokenStatus
);
router.post(
  "/reset-password",
  validatePassword,
  validate,
  isValidPassResetToken,
  resetPassword
);

module.exports = router;
