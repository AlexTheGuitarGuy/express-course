import Course from "../models/Course.js";
import asyncHandler from "../middleware/asyncHandler.js";
import Bootcamp from "../models/Bootcamp.js";
import { ErrorResponse } from "../utils/errorResponse.js";

//  @desc     Get all courses
//  @route    GET /api/v1/courses
//  @route    GET /api/v1/bootcamps/:bootcampId/courses
//  @access   Public
export const getCourses = asyncHandler(async (req, res, next) => {
  const { bootcampId } = req.params;

  let query;

  if (bootcampId) query = Course.find({ bootcamp: bootcampId });
  else query = Course.find();

  query.populate({
    path: "bootcamp",
    select: "name description",
  });

  const courses = await query;

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});

//  @desc     Get one course
//  @route    GET /api/v1/course/:id
//  @access   Public
export const getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });

  if (!course)
    return next(
      new ErrorResponse(`Could not find course with ID ${req.params.id}`, 404)
    );

  res.status(200).json({ success: true, data: course });
});

//  @desc     Post one course
//  @route    POST /api/v1/bootcamps/:bootcampId/course
//  @access   Private
export const postCourse = asyncHandler(async (req, res, next) => {
  const { bootcampId } = req.params;

  req.body.bootcamp = bootcampId;

  const bootcamp = await Bootcamp.findById(bootcampId);

  if (!bootcamp)
    return next(
      new ErrorResponse(`Could not find bootcamp with ID ${bootcampId}`, 404)
    );

  const course = await Course.create(req.body);

  res.status(201).json({ success: true, data: course });
});

//  @desc     Update course
//  @route    PUT /api/v1/course/:id
//  @access   Private
export const putCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!course)
    return next(
      new ErrorResponse(`Could not find course with ID ${req.params.id}`, 404)
    );

  res.status(200).json({ success: true, data: course });
});

//  @desc     Delete course
//  @route    DELETE /api/v1/course/:id
//  @access   Private
export const deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findByIdAndDelete(req.params.id);

  if (!course)
    return next(
      new ErrorResponse(`Could not find course with ID ${req.params.id}`, 404)
    );

  res.status(200).json({ success: true, data: course });
});
