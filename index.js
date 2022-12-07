import express from "express";
import dotenv from "dotenv";
import bitches from "./routes/bitches.js";

dotenv.config({
  path: "./config/config.env",
});

const { PORT = 6969, NODE_ENV } = process.env;

const app = express();

app.listen(PORT, () => console.log(`Hui on port ${PORT} in ${NODE_ENV} mode.`));

const baseUrl = "/api/v1/";
app.use(`${baseUrl}bitches`, bitches);
