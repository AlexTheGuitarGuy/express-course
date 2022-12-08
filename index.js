import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import colors from "colors";

import bootcamps from "./routes/bootcamps.js";
import connectDb from "./config/db.js";

dotenv.config({
  path: "./config/config.env",
});

connectDb();

const { PORT = 6969, NODE_ENV } = process.env;

const app = express();
const server = app.listen(PORT, () =>
  console.log(
    `Server open on port ${PORT} in ${NODE_ENV} mode.`.yellow.bold.underline
  )
);

process.on("unhandledRejection", (error) => {
  console.log(`Error: ${error.message}`.red.bold);

  server.close(() => process.exit(1));
});

if (NODE_ENV === "development") app.use(morgan("dev"));

const baseUrl = "/api/v1";
app.use(`${baseUrl}/bootcamps`, bootcamps);
