import asyncHandler from "./asyncHandler.js";
import { ErrorResponse } from "../utils/errorResponse.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = asyncHandler(async (req, res, next) => {
  const { JWT_SECRET } = process.env;

  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  )
    token = req.headers.authorization.split(" ")[1];
  // else if (req.cookies.token) token = req.cookies.token;

  if (!token) return next(new ErrorResponse("You are unauthorized.", 401));

  try {
    const data = jwt.verify(token, JWT_SECRET, {}, null);

    const user = await User.findById(data.id);
    if (!user)
      return next(
        new ErrorResponse(`User with ID ${data.id} was not found.`, 400)
      );

    req.user = user;

    next();
  } catch (error) {
    return next(new ErrorResponse(error.message, 500));
  }
});

export const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new ErrorResponse(
          `The role of ${req.user.role} is unauthorized to access this route.`,
          403
        )
      );
    next();
  };
