import Bootcamp from "../models/Bootcamp.js";

//  @desc     Get all bootcamps
//  @route    GET /api/v1/bootcamps
//  @access   Public
export const getBootcamps = (req, res, next) => {
  Bootcamp.find()
    .then((bootcamps) => {
      res
        .status(200)
        .json({ success: true, count: bootcamps.length, data: bootcamps });
    })
    .catch((err) => {
      next(err);
    });
};

//  @desc     Get one bootcamp
//  @route    GET /api/v1/bootcamp/:id
//  @access   Public
export const getBootcamp = (req, res, next) => {
  Bootcamp.findById(req.params.id)
    .then((bootcamp) => {
      if (!bootcamp)
        throw new Error(`There is no bootcamp with this ID: ${req.params.id}`);

      res.status(200).json({ success: true, data: bootcamp });
    })
    .catch((err) => {
      next(err);
    });
};

//  @desc     Post one bootcamp
//  @route    GET /api/v1/bootcamp
//  @access   Private
export const postBootcamp = (req, res, next) => {
  Bootcamp.create(req.body)
    .then((bootcamp) => {
      res.status(201).json({ success: true, data: bootcamp });
    })
    .catch((err) => {
      next(err);
    });
};

//  @desc     Update bootcamp
//  @route    GET /api/v1/bootcamp/:id
//  @access   Private
export const putBootcamp = (req, res, next) => {
  Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .then((bootcamp) => {
      if (!bootcamp)
        throw new Error(`There is no bootcamp with this ID: ${req.params.id}`);

      res.status(200).json({ success: true, data: bootcamp });
    })
    .catch((err) => {
      next(err);
    });
};

//  @desc     Delete bootcamp
//  @route    GET /api/v1/bootcamp/:id
//  @access   Private
export const deleteBootcamp = (req, res, next) => {
  Bootcamp.findByIdAndDelete(req.params.id)
    .then((bootcamp) => {
      if (!bootcamp)
        throw new Error(`There is no bootcamp with this ID: ${req.params.id}`);

      res.status(200).json({ success: true, data: bootcamp });
    })
    .catch((err) => {
      next(err);
    });
};
