import express from "express";
import dotenv from "dotenv";

dotenv.config({
  path: "./config/config.env",
});

const { PORT = 6969, NODE_ENV } = process.env;

const app = express();

app.listen(PORT, () => console.log(`Hui on port ${PORT} in ${NODE_ENV} mode.`));
