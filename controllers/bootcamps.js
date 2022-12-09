import Bootcamp from "../models/Bootcamp.js";
import asyncHandler from "../middleware/asyncHandler.js";

//  @desc     Get all bootcamps
//  @route    GET /api/v1/bootcamps
//  @access   Public
export const getBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamps = await Bootcamp.find();

  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});

//  @desc     Get one bootcamp
//  @route    GET /api/v1/bootcamp/:id
//  @access   Public
export const getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp)
    throw new Error(`Could not find bootcamp with ID ${req.params.id}`);

  res.status(200).json({ success: true, data: bootcamp });
});

//  @desc     Post one bootcamp
//  @route    GET /api/v1/bootcamp
//  @access   Private
export const postBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);

  res.status(201).json({ success: true, data: bootcamp });
});

//  @desc     Update bootcamp
//  @route    GET /api/v1/bootcamp/:id
//  @access   Private
export const putBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!bootcamp)
    throw new Error(`Could not find bootcamp with ID ${req.params.id}`);

  res.status(200).json({ success: true, data: bootcamp });
});

//  @desc     Delete bootcamp
//  @route    GET /api/v1/bootcamp/:id
//  @access   Private
export const deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

  if (!bootcamp)
    throw new Error(`Could not find bootcamp with ID ${req.params.id}`);

  res.status(200).json({ success: true, data: bootcamp });
});
