const { isValidObjectId } = require("mongoose");
const { sendError } = require("../utils/helper");
const PasswordResetToken = require("../models/passwordResetToken");

exports.isValidPassResetToken = async (req, res, next) => {
  const { token, userId } = req.body;

  if (!token.trim() || !isValidObjectId(userId))
    return sendError(res, "Invalid request");
  const resetToken = await PasswordResetToken.findOne({ owner: userId });

  if (!resetToken) return sendError(res, "Unauthorized, Invalid request!");

  const match = await resetToken.compareTokens(token);
  if (!match) return sendError(res, "Unauthorized, Invalid request!");

  req.resetToken = resetToken;

  next();
};
