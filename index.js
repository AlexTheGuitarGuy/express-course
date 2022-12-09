import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import colors from "colors";

import connectDb from "./config/db.js";
import bootcamps from "./routes/bootcamps.js";
import errorHandler from "./middleware/errorHandler.js";

//  Environment variables
dotenv.config({
  path: "./config/config.env",
});
const { PORT = 6969, NODE_ENV } = process.env;

//  Opening server and database
const app = express();
const server = app.listen(PORT, () =>
  console.log(
    `Server open on port ${PORT} in ${NODE_ENV} mode.`.yellow.bold.underline
  )
);
connectDb();

process.on("unhandledRejection", (error) => {
  console.log(`Error: ${error.message}`.red.bold);

  server.close(() => process.exit(1));
});

//  Middleware before API
if (NODE_ENV === "development") app.use(morgan("dev"));
app.use(express.json());

//  API implementation
const baseUrl = "/api/v1";
app.use(`${baseUrl}/bootcamps`, bootcamps);

//  Middleware after API
app.use(errorHandler);
