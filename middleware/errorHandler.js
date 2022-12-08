const errorHandler = (err, req, res, next) => {
  console.log(err.stack.red);

  res.status(400).json({ success: false, message: err.message });
};

export default errorHandler;
