import { ErrorResponse } from "../utils/errorResponse.js";

const errorHandler = (err, req, res, next) => {
  console.log(err.name);

  let formattedError;
  if (err.name === "CastError") {
    formattedError = new ErrorResponse(
      `Could not find resource with ID ${err.value}`,
      404
    );
  } else if (err.code === 11000) {
    formattedError = new ErrorResponse(`Duplicate field value entered`, 400);
  } else if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((element) => element.message)
      .join(", ");
    formattedError = new ErrorResponse(message, 400);
  }

  res.status(formattedError?.statusCode || 500).json({
    success: false,
    message: formattedError?.message || err?.message || "Server Error",
  });
};

export default errorHandler;
