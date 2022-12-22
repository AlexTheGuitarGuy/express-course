import Bootcamp from "../models/Bootcamp.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { ErrorResponse } from "../utils/errorResponse.js";
import path from "path";

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

//  @desc     Add photo to bootcamp
//  @route    PUT /api/v1/bootcamp/:id/photos
//  @access   Private
export const uploadBootcampPhoto = asyncHandler(async (req, res, next) => {
  const { MAX_FILE_SIZE, FILE_UPLOAD_PATH } = process.env;

  const { id: bootcampId } = req.params;

  const bootcamp = await Bootcamp.findById(bootcampId);

  if (!bootcamp)
    return next(
      new ErrorResponse(`Could not find bootcamp with ID ${bootcampId}`, 404)
    );

  if (!req.files)
    return next(new ErrorResponse("Could not find file inside request", 400));

  const image = req.files.file;

  if (!image.mimetype.startsWith("image"))
    return next(
      new ErrorResponse(
        `Only images are allowed, file of type ${image.mimetype} is invalid.`,
        400
      )
    );

  if (image.size > MAX_FILE_SIZE)
    return next(
      new ErrorResponse(
        `Maximum file size is ${MAX_FILE_SIZE}, the image's size is ${image.size}.`,
        400
      )
    );

  image.name = `photo_${bootcampId}${path.parse(image.name).ext}`;

  console.log(FILE_UPLOAD_PATH, MAX_FILE_SIZE);

  image.mv(`${FILE_UPLOAD_PATH}/${image.name}`, async (error) => {
    console.error(error);
    if (error)
      return next(
        new ErrorResponse(
          "An error has occurred while uploading the file.",
          500
        )
      );

    try {
      await Bootcamp.findByIdAndUpdate(bootcampId, { photo: image.name });

      res.status(200).json({
        success: true,
        data: image.name,
      });
    } catch (error) {
      console.error(error);
      return next(
        new ErrorResponse(`Could not update bootcamp: ${error.message}`, 500)
      );
    }
  });
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
