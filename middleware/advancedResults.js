const advancedResults = (model, populate) => async (req, res, next) => {
  let query = { ...req.query };

  // Remove query params with custom implementation
  const queryParamsToRemove = ["select", "sort", "page", "limit"];
  queryParamsToRemove.forEach((element) => delete query[element]);

  // Format query for Mongo methods
  query = JSON.stringify(query);
  query = query.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);
  query = JSON.parse(query);

  query = model.find(query);

  if (populate && (!req.query.select || req.query.select.includes(populate)))
    query.populate(populate);

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
  const totalElems = await model.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // Await query
  const results = await query;

  // Add pagination data for easier frontend use
  const pagination = {};

  if (startIndex > 0)
    pagination.prev = {
      page: page - 1,
      limit,
    };
  pagination.curr = {
    page,
    limit,
  };
  if (endIndex < totalElems) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results,
  };

  next();
};

export default advancedResults;
