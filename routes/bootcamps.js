import express from "express";
import {
  getBootcamp,
  getBootcamps,
  postBootcamp,
  putBootcamp,
  deleteBootcamp,
} from "../controllers/bootcamps.js";

import courseRouter from "./courses.js";

const router = express.Router();

router.use("/:bootcampId/courses", courseRouter);

router.route("/").get(getBootcamps).post(postBootcamp);

router.route(`/:id`).get(getBootcamp).put(putBootcamp).delete(deleteBootcamp);

export default router;
