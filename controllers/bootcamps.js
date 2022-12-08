//  @desc     Get all bootcamps
//  @route    GET /api/v1/bootcamps
//  @access   Public
export const getBootcamps = (req, res) => {
  res.status(200).json({ message: "Fetched all the bootcamps" });
};

//  @desc     Get one bootcamp
//  @route    GET /api/v1/bootcamp/:id
//  @access   Public
export const getBootcamp = (req, res) => {
  res
    .status(200)
    .json({ message: `Fetched bootcamp with id ${req.params.id}` });
};

//  @desc     Post one bootcamp
//  @route    GET /api/v1/bootcamp
//  @access   Private
export const postBootcamp = (req, res) => {
  res.status(201).json({ message: "Posted bootcamp" });
};

//  @desc     Update bootcamp
//  @route    GET /api/v1/bootcamp/:id
//  @access   Private
export const putBootcamp = (req, res) => {
  res
    .status(201)
    .json({ message: `Updated bootcamp with id ${req.params.id}` });
};

//  @desc     Delete bootcamp
//  @route    GET /api/v1/bootcamp/:id
//  @access   Private
export const deleteBootcamp = (req, res) => {
  res
    .status(200)
    .json({ message: `Deleted bootcamp with id ${req.params.id}` });
};
