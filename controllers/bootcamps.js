import Bootcamp from "../models/Bootcamp.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { ErrorResponse } from "../utils/errorResponse.js";

//  @desc     Get all bootcamps
//  @route    GET /api/v1/bootcamps
//  @access   Public
export const getBootcamps = asyncHandler(async (req, res, next) => {
  let query = { ...req.query };

  // Remove query params with custom implementation
  const queryParamsToRemove = ["select", "sort", "page", "limit"];
  queryParamsToRemove.forEach((element) => delete query[element]);

  // Format query for Mongo methods
  query = JSON.stringify(query);
  query = query.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);
  query = JSON.parse(query);

  query = Bootcamp.find(query).populate("courses");

  // Custom implementations
  if (req.query.select) {
    const selectFields = req.query.select.split(",").join(" ");

    query = query.select(selectFields);
  }

  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");

    query = query.sort(sortBy);
  } else query = query.sort("-createdAt");

  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const totalElems = await Bootcamp.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // Await query
  const bootcamps = await query;

  // Add pagination data for easier frontend use
  const pagination = {};

  if (endIndex < totalElems)
    pagination.next = {
      page: page + 1,
      limit,
    };
  if (startIndex > 0)
    pagination.prev = {
      page: page - 1,
      limit,
    };

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    pagination,
    data: bootcamps,
  });
});

//  @desc     Get one bootcamp
//  @route    GET /api/v1/bootcamp/:id
//  @access   Public
export const getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp)
    return next(
      new ErrorResponse(`Could not find bootcamp with ID ${req.params.id}`, 404)
    );

  res.status(200).json({ success: true, data: bootcamp });
});

//  @desc     Post one bootcamp
//  @route    POST /api/v1/bootcamp
//  @access   Private
export const postBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);

  res.status(201).json({ success: true, data: bootcamp });
});

//  @desc     Update bootcamp
//  @route    PUT /api/v1/bootcamp/:id
//  @access   Private
export const putBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!bootcamp)
    return next(
      new ErrorResponse(`Could not find bootcamp with ID ${req.params.id}`, 404)
    );

  res.status(200).json({ success: true, data: bootcamp });
});

//  @desc     Delete bootcamp
//  @route    DELETE /api/v1/bootcamp/:id
//  @access   Private
export const deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp)
    return next(
      new ErrorResponse(`Could not find bootcamp with ID ${req.params.id}`, 404)
    );

  bootcamp.remove();

  res.status(200).json({ success: true, data: bootcamp });
});
