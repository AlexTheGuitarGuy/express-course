import asyncHandler from "../middleware/asyncHandler.js";
import Review from "../models/Review.js";
import { ErrorResponse } from "../utils/errorResponse.js";
import Bootcamp from "../models/Bootcamp.js";

//  @desc     Get all reviews
//  @route    GET /api/v1/reviews
//  @route    GET /api/v1/bootcamps/:bootcampId/reviews
//  @access   Public
export const getReviews = asyncHandler(async (req, res, next) => {
  const { bootcampId } = req.params;

  if (bootcampId) {
    const reviews = await Review.find({ bootcamp: bootcampId });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } else res.status(200).json(res.advancedResults);
});

//  @desc     Get review by ID
//  @route    GET /api/v1/reviews/:id
//  @access   Public
export const getReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const review = await Review.findById(id).populate(
    "bootcamp",
    "name description"
  );

  if (!review)
    return next(new ErrorResponse(`Could not find review with ID ${id}`, 404));

  res.status(200).json({ success: true, data: review });
});

//  @desc     Post new review
//  @route    POST /api/v1/bootcamps/:bootcampId/reviews
//  @access   Private
export const postReview = asyncHandler(async (req, res, next) => {
  const { bootcampId } = req.params;

  req.body.bootcamp = bootcampId;
  req.body.user = req.user.id;

  const bootcamp = await Bootcamp.findById(bootcampId);

  if (!bootcamp)
    return next(
      new ErrorResponse(`Could not find bootcamp with ID ${bootcampId}`, 404)
    );

  const review = await Review.create(req.body);

  res.status(200).json({ success: true, data: review });
});

//  @desc     Update review
//  @route    PUT /api/v1/reviews/:id
//  @access   Private
export const putReview = asyncHandler(async (req, res, next) => {
  const reviewId = req.params.id;
  const userId = req.user.id;

  let review = await Review.findById(reviewId);

  if (!review)
    return next(
      new ErrorResponse(`Could not find review with ID ${reviewId}.`, 404)
    );

  if (review.user.toString() !== userId && req.user.role !== "admin")
    return next(
      new ErrorResponse(
        `User with ID ${userId} can't update review with ID ${reviewId}`,
        403
      )
    );

  review = await Review.findByIdAndUpdate(reviewId, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: review });
});

//  @desc     Delete review
//  @route    DELETE /api/v1/reviews/:id
//  @access   Private
export const deleteReview = asyncHandler(async (req, res, next) => {
  const reviewId = req.params.id;
  const userId = req.user.id;

  const review = await Review.findById(reviewId);

  if (!review)
    return next(
      new ErrorResponse(`Could not find review with ID ${reviewId}.`, 404)
    );

  if (review.user.toString() !== userId && req.user.role !== "admin")
    return next(
      new ErrorResponse(
        `User with ID ${userId} can't delete review with ID ${reviewId}`,
        403
      )
    );

  review.remove();

  res.status(200).json({ success: true, data: review });
});
