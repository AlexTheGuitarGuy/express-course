import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/User.js";
import { ErrorResponse } from "../utils/errorResponse.js";

//  @desc     Get all users
//  @route    GET /api/v1/users
//  @access   Private/Admin
export const getUsers = asyncHandler((req, res, next) => {
  res.status(200).json(res.advancedResults);
});

//  @desc     Get user by ID
//  @route    GET /api/v1/users/:id
//  @access   Private/Admin
export const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user)
    return next(
      new ErrorResponse(
        `User with ID ${req.params.id} could not be found.`,
        404
      )
    );

  res.status(200).json({ success: true, data: user });
});

//  @desc     Post user to database
//  @route    POST /api/v1/users
//  @access   Private/Admin
export const postUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({ success: true, data: user });
});

//  @desc     Update user in database
//  @route    PUT /api/v1/users/:id
//  @access   Private/Admin
export const putUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user)
    return next(
      new ErrorResponse(`Could not find user with ID ${req.params.id}.`, 404)
    );

  const possibleRoles = ["user", "publisher"];

  if (!possibleRoles[user.role])
    return next(new ErrorResponse(`Role ${user.role} is not allowed.`, 403));

  res.status(200).json({ success: true, data: user });
});

//  @desc     Delete user from database
//  @route    Delete /api/v1/users/:id
//  @access   Private/Admin
export const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user)
    return next(
      new ErrorResponse(`Could not find user with ID ${req.params.id}.`, 404)
    );

  user.remove();

  res.status(200).json({ success: true, data: user });
});
