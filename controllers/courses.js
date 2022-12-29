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

  if (bootcampId) {
    const courses = await Course.find({ bootcamp: bootcampId });

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } else res.status(200).json(res.advancedResults);
});

//  @desc     Get one course
//  @route    GET /api/v1/courses/:id
//  @access   Public
export const getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });

  if (!course)
    return next(
      new ErrorResponse(`Could not find course with ID ${req.params.id}.`, 404)
    );

  res.status(200).json({ success: true, data: course });
});

//  @desc     Post one course
//  @route    POST /api/v1/bootcamps/:bootcampId/course
//  @access   Private
export const postCourse = asyncHandler(async (req, res, next) => {
  const { bootcampId } = req.params;

  req.body.bootcamp = bootcampId;
  req.body.user = req.user.id;

  const bootcamp = await Bootcamp.findById(bootcampId);

  if (!bootcamp)
    return next(
      new ErrorResponse(`Could not find bootcamp with ID ${bootcampId}.`, 404)
    );

  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin")
    return next(
      new ErrorResponse(
        `User with ID ${req.user.id} cannot post course to bootcamp with ID ${req.params.bootcampId}.`,
        401
      )
    );

  const course = await Course.create(req.body);

  res.status(201).json({ success: true, data: course });
});

//  @desc     Update course
//  @route    PUT /api/v1/courses/:id
//  @access   Private
export const putCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course)
    return next(
      new ErrorResponse(`Could not find course with ID ${req.params.id}.`, 404)
    );

  console.log(course.user.toString(), req.user.id);

  if (course.user.toString() !== req.user.id && req.user.role !== "admin")
    return next(
      new ErrorResponse(
        `User with ID ${req.user.id} cannot update course with ID ${req.params.id}.`,
        401
      )
    );

  course = await Course.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: course });
});

//  @desc     Delete course
//  @route    DELETE /api/v1/courses/:id
//  @access   Private
export const deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findByIdAndDelete(req.params.id);

  if (!course)
    return next(
      new ErrorResponse(`Could not find course with ID ${req.params.id}.`, 404)
    );

  if (course.user.toString() !== req.user.id && req.user.role !== "admin")
    return next(
      new ErrorResponse(
        `User with ID ${req.user.id} cannot delete course with ID ${req.params.id}.`,
        401
      )
    );

  res.status(200).json({ success: true, data: course });
});
