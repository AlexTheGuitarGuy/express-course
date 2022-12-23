import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/User.js";
import { ErrorResponse } from "../utils/errorResponse.js";

//  @desc       Register user
//  @route      api/v1/auth/register
//  @access     Public
export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const user = await User.create({ name, email, password, role });

  sendTokenResponse(user, 200, res);
});

//  @desc       Log user in
//  @route      api/v1/auth/login
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

//  @desc       Get logged-in user
//  @route      api/v1/auth/me
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
