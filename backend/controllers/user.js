const User = require("../models/user");
const jwt = require("jsonwebtoken");
const EmailVerificationToken = require("../models/emailVerificationToken");
const PasswordResetToken = require("../models/passwordResetToken");
const { isValidObjectId } = require("mongoose");
const { generateOTP, generateMailTransporter } = require("../utils/mail");
const { sendError, generateRandomByte } = require("../utils/helper");

exports.create = async (req, res) => {
  const { name, email, password } = req.body;

  const oldUser = await User.findOne({ email });

  if (oldUser) return sendError(res, "This email is already in use");

  const newUser = new User({ name, email, password });
  await newUser.save();

  // generate 6 digit OTP

  let OTP = generateOTP();

  // Store OTP in our DB

  const newEmailVerificationToken = new EmailVerificationToken({
    owner: newUser._id,
    token: OTP,
  });

  await newEmailVerificationToken.save();

  // send this OTP to our user

  var transport = generateMailTransporter();

  transport.sendMail({
    from: "verification@review_app.com",
    to: newUser.email,
    subject: "Email Verification",
    html: `
      <p>Your verification OTP</p>
      <h1>${OTP}</h1>
    `,
  });

  res.status(201).json({
    message:
      "Please verify your email. OTP has been sent to your email account",
  });
};

exports.verifyEmail = async (req, res) => {
  const { userId, OTP } = req.body;

  if (!isValidObjectId(userId)) return sendError(res, "Invalid user!");

  const user = await User.findById(userId);
  if (!user) return sendError(res, "user not found"), 404;
  if (user.isVerified) return sendError(res, "user is already verified!");
  const token = await EmailVerificationToken.findOne({ owner: userId });
  if (!token) return sendError(res, "token not found", 404);
  const isMatched = await token.compareTokens(OTP);

  if (!isMatched) return sendError(res, "Please submit a valid OTP!");
  user.isVerified = true;
  await user.save();

  await EmailVerificationToken.findByIdAndDelete(token._id);

  var transport = generateMailTransporter();

  transport.sendMail({
    from: "verification@review_app.com",
    to: user.email,
    subject: "Welcome Email",
    html: "<h1>Welcome to our app and thanks for choosing us!</h1>",
  });

  res.json({ message: "Your email is verified." });
};

exports.resendEmailVerificationToken = async (req, res) => {
  const { userId } = req.body;

  if (!isValidObjectId(userId)) return sendError(res, "Invalid user!");
  const user = await User.findById(userId);
  if (!user) return sendError(res, "user not found", 404);

  const alreadyHasToken = await EmailVerificationToken.findOne({
    owner: userId,
  });

  if (alreadyHasToken)
    return sendError(
      res,
      "Only after one hour you can request for an other token"
    );
  // generate 6 digit OTP

  let OTP = generateOTP();

  // Store OTP in our DB

  const newEmailVerificationToken = new EmailVerificationToken({
    owner: user._id,
    token: OTP,
  });

  await newEmailVerificationToken.save();

  // send this OTP to our user

  var transport = generateMailTransporter();

  transport.sendMail({
    from: "verification@review_app.com",
    to: user.email,
    subject: "Email Verification",
    html: `
      <p>Your verification OTP</p>
      <h1>${OTP}</h1>
    `,
  });

  res.status(200).json({
    message:
      "Please verify your email. OTP has been sent to your email account",
  });
};

exports.forgetPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) return sendError(res, "Email is missing!");

  const user = await User.findOne({ email });

  if (!user) return sendError(res, "User not found!", 404);

  const alreadyHasToken = await PasswordResetToken.findOne({ owner: user._id });
  if (alreadyHasToken)
    return sendError(
      res,
      "Only after one hour you can request for an other token"
    );

  const token = await generateRandomByte();

  const newPasswordResetToken = await new PasswordResetToken({
    owner: user._id,
    token,
  });

  await newPasswordResetToken.save();

  const resetPasswordUrl = `http://localhost:3000/reset-password?token=${token}&id=${user._id}`;

  var transport = generateMailTransporter();

  transport.sendMail({
    from: "security@review_app.com",
    to: user.email,
    subject: "Reset Password Link",
    html: `
      <p>Click the link bellow to reset your password</p>
      <a href='${resetPasswordUrl}'>Change password</a>
    `,
  });

  res.status(200).json({
    message:
      "Please verify your email. The link to reset your password has been sent to your email account",
  });
};

exports.sendPasswordResetTokenStatus = (req, res) => {
  res.json({ valid: true });
};

exports.resetPassword = async (req, res) => {
  const { newPassword, userId } = req.body;

  const user = await User.findById(userId);
  const matched = await user.comparePasswords(newPassword);
  if (matched)
    return sendError(
      res,
      "The new password must be different from the old one"
    );

  user.password = newPassword;
  await user.save();

  await PasswordResetToken.findByIdAndDelete(req.resetToken._id);

  var transport = generateMailTransporter();

  transport.sendMail({
    from: "security@review_app.com",
    to: user.email,
    subject: "Password reset successfully!",
    html: `
      <h1>Password reset successfully</h1>
      <p>Now you can use new password</p>
    `,
  });

  res.status(200).json({
    message: "Password reset successfully, now you can use your new password",
  });
};

exports.SignIn = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return sendError(res, "Email/password mismatch!");

  const matched = await user.comparePasswords(password);
  if (!matched) return sendError(res, "Email/Password mismatch!");

  const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      token: jwtToken,
    },
  });
};
