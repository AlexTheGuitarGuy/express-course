import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import colors from "colors";
import fileupload from "express-fileupload";
import path from "path";
import { fileURLToPath } from "url";
import expressMongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import xssClean from "xss-clean";
import hpp from "hpp";
import cors from "cors";
import expressRateLimit from "express-rate-limit";

import connectDb from "./config/db.js";
import bootcamps from "./routes/bootcamps.js";
import courses from "./routes/courses.js";
import auth from "./routes/auth.js";
import errorHandler from "./middleware/errorHandler.js";
import cookieParser from "cookie-parser";
import users from "./routes/users.js";
import reviews from "./routes/reviews.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
app.use(fileupload({}));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(express.json());
app.use(expressMongoSanitize());
app.use(helmet());
app.use(xssClean());
app.use(hpp());
app.use(cors());

const limiter = expressRateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
});

app.use(limiter);

//  API implementation
const baseUrl = "/api/v1";
app.use(`${baseUrl}/bootcamps`, bootcamps);
app.use(`${baseUrl}/courses`, courses);
app.use(`${baseUrl}/auth`, auth);
app.use(`${baseUrl}/users`, users);
app.use(`${baseUrl}/reviews`, reviews);

//  Middleware after API
app.use(errorHandler);
