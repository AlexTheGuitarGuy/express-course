import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/User.js";
import { ErrorResponse } from "../utils/errorResponse.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";

//  @desc       Register user
//  @route      POST api/v1/auth/register
//  @access     Public
export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const user = await User.create({ name, email, password, role });

  sendTokenResponse(user, 200, res);
});

//  @desc       Log user in
//  @route      POST api/v1/auth/login
//  @access     Public
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email) return next(new ErrorResponse("Email is required.", 400));
  if (!password) return next(new ErrorResponse("Password is required.", 400));

  const user = await User.findOne({ email }).select("+password");

  if (!user) return next(new ErrorResponse("Invalid credentials.", 401));

  const isPasswordValid = await user.matchPassword(password);

  if (!isPasswordValid)
    return next(new ErrorResponse("Invalid credentials.", 401));

  sendTokenResponse(user, 200, res);
});

//  @desc       Get logged-in user
//  @route      GET api/v1/auth/me
//  @access     Private
export const getMe = asyncHandler(async (req, res, next) => {
  if (!req.user || !req.user.id)
    return next(new ErrorResponse("Cannot find logged in user.", 500));

  const user = await User.findById(req.user.id);

  if (!user)
    return next(
      new ErrorResponse(`User with ID ${req.user.id} was not found.`, 500)
    );

  res.status(200).json({ success: true, data: user });
});

//  @desc       Send reset password email
//  @route      POST api/v1/auth/forgot-password
//  @access     Public
export const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user)
    return next(
      new ErrorResponse(
        `Could not find user with email ${req.body.email}.`,
        404
      )
    );

  const resetToken = user.getResetToken();

  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/reset-password/${resetToken}`;

  const message = `You have requested a password reset. To continue, create a put request at ${resetUrl} . If you didn't intend to reset your password, just ignore this message.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset request.",
      message,
    });

    res.status(200).json({ success: true, data: "Email has been sent." });
  } catch (error) {
    console.error(error);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(
      new ErrorResponse(
        `Could not send reset password email: ${error.message}`,
        500
      )
    );
  }
});

//  @desc       Reset password
//  @route      PUT api/v1/auth/reset-password/:resetToken
//  @access     Public
export const resetPassword = asyncHandler(async (req, res, next) => {
  if (!req.body.password)
    return next(new ErrorResponse("Please add a password to the body.", 400));

  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user)
    return next(
      new ErrorResponse(`Token ${req.params.resetToken} is invalid.`, 400)
    );

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetpasswordExpire = undefined;
  await user.save({ validateBeforeSave: false });

  sendTokenResponse(user, 200, res);
});

//  @desc       Update user email and name
//  @route      PUT api/v1/auth/update-details
//  @access     Private
export const updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    email: req.body.email,
    name: req.body.name,
  };

  if (!fieldsToUpdate.email || !fieldsToUpdate.name)
    return next(new ErrorResponse("Please add both email and name.", 400));

  if (!req.user) return next(new ErrorResponse("No user is authorized.", 401));

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  if (!user) return next(new ErrorResponse("User not found.", 500));

  res.status(200).json({ success: true, data: user });
});

//  @desc       Update logged user password
//  @route      PUT api/v1/auth/update-password
//  @access     Private
export const updatePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword)
    return next(
      new ErrorResponse(
        "Please add both the current and the new password.",
        400
      )
    );

  const user = await User.findById(req.user.id).select("+password");

  const isPasswordValid = await user.matchPassword(currentPassword);

  if (!isPasswordValid)
    return next(new ErrorResponse("Current password is invalid.", 401));

  user.password = newPassword;

  await user.save();

  sendTokenResponse(user, 200, res);
});

const sendTokenResponse = (user, responseStatus, res) => {
  const { JWT_COOKIE_EXPIRE, NODE_ENV } = process.env;

  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(Date.now() + JWT_COOKIE_EXPIRE * 1000 * 60 * 60 * 24),
    httpOnly: true,
  };

  if (NODE_ENV === "production") options.secure = true;

  res
    .status(responseStatus)
    .cookie("token", token, options)
    .json({ success: true, token });
};
