import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";

import bitches from "./routes/bitches.js";
import connectDb from "./config/db.js";

dotenv.config({
  path: "./config/config.env",
});

connectDb();

const { PORT = 6969, NODE_ENV } = process.env;

const app = express();
const server = app.listen(PORT, () =>
  console.log(`Hui on port ${PORT} in ${NODE_ENV} mode.`)
);

process.on("unhandledRejection", (error) => {
  console.log(`Error: ${error.message}`);

  server.close(() => process.exit(1));
});

if (NODE_ENV === "development") app.use(morgan("dev"));

const baseUrl = "/api/v1";
app.use(`${baseUrl}/bitches`, bitches);
