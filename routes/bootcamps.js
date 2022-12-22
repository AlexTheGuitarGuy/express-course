import express from "express";
import {
  getBootcamp,
  getBootcamps,
  postBootcamp,
  putBootcamp,
  deleteBootcamp,
  uploadBootcampPhoto,
} from "../controllers/bootcamps.js";

import courseRouter from "./courses.js";
import advancedResults from "../middleware/advancedResults.js";
import Bootcamp from "../models/Bootcamp.js";

const router = express.Router();

router.use("/:bootcampId/courses", courseRouter);

router
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), getBootcamps)
  .post(postBootcamp);

router.route(`/:id`).get(getBootcamp).put(putBootcamp).delete(deleteBootcamp);

router.route("/:id/photos").put(uploadBootcampPhoto);

export default router;
