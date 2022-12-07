//  @desc     Get all bitches
//  @route    GET /api/v1/bitches
//  @access   Public
export const getBitches = (req, res) => {
  res.status(200).json({ message: "Fetched all the bitches" });
};

//  @desc     Get one bitch
//  @route    GET /api/v1/bitch/:id
//  @access   Public
export const getBitch = (req, res) => {
  res.status(200).json({ message: `Fetched bitch with id ${req.params.id}` });
};

//  @desc     Post one bitch
//  @route    GET /api/v1/bitch
//  @access   Private
export const postBitch = (req, res) => {
  res.status(201).json({ message: "Posted bitch" });
};

//  @desc     Update bitch
//  @route    GET /api/v1/bitch/:id
//  @access   Private
export const putBitch = (req, res) => {
  res.status(201).json({ message: `Updated bitch with id ${req.params.id}` });
};

//  @desc     Delete bitch
//  @route    GET /api/v1/bitch/:id
//  @access   Private
export const deleteBitch = (req, res) => {
  res.status(200).json({ message: `Deleted bitch with id ${req.params.id}` });
};
