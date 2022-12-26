import Bootcamp from "../models/Bootcamp.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { ErrorResponse } from "../utils/errorResponse.js";
import path from "path";

//  @desc     Get all bootcamps
//  @route    GET /api/v1/bootcamps
//  @access   Public
export const getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
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
  req.body.user = req.user.id;

  const userId = req.body.user;

  let bootcamp = await Bootcamp.findOne({ user: userId });
  if (bootcamp && req.user.role !== "admin")
    return next(
      new ErrorResponse(
        `User with ID ${userId} has already posted a bootcamp.`,
        401
      )
    );

  bootcamp = await Bootcamp.create(req.body);

  res.status(201).json({ success: true, data: bootcamp });
});

//  @desc     Update bootcamp
//  @route    PUT /api/v1/bootcamp/:id
//  @access   Private
export const putBootcamp = asyncHandler(async (req, res, next) => {
  let bootcamp = await Bootcamp.findById(req.params.id);

  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin")
    return next(
      new ErrorResponse(
        `User with ID ${req.user.id} cannot update bootcamp with ID ${req.params.id}`,
        401
      )
    );

  bootcamp = await Bootcamp.findOneAndUpdate(req.params.id, req.body, {
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

  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin")
    return next(
      new ErrorResponse(
        `User with ID ${req.user.id} cannot upload photo to bootcamp with ID ${req.params.id}`,
        401
      )
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
      await Bootcamp.findOneAndUpdate(bootcampId, { photo: image.name });

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

  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin")
    return next(
      new ErrorResponse(
        `User with ID ${req.user.id} cannot upload photo to bootcamp with ID ${req.params.id}`,
        401
      )
    );

  bootcamp.remove();

  res.status(200).json({ success: true, data: bootcamp });
});
