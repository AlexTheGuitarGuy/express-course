const logger = (req, res, next) => {
  const { method, url, protocol } = req;
  console.log(`${method} request at ${protocol}://${req.get("host")}${url}`);

  next();
};

export default logger;
