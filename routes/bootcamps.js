import { Router } from "express";
import {
  getBootcamp,
  getBootcamps,
  postBootcamp,
  putBootcamp,
  deleteBootcamp,
  uploadBootcampPhoto,
} from "../controllers/bootcamps.js";

import courseRouter from "./courses.js";
import reviewRouter from "./reviews.js";
import advancedResults from "../middleware/advancedResults.js";
import Bootcamp from "../models/Bootcamp.js";
import { authorize, protect } from "../middleware/auth.js";

const router = Router();

router.use("/:bootcampId/courses", courseRouter);
router.use("/:bootcampId/reviews", reviewRouter);

router
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), getBootcamps)
  .post(protect, authorize("publisher", "admin"), postBootcamp);

router
  .route(`/:id`)
  .get(getBootcamp)
  .put(protect, authorize("publisher", "admin"), putBootcamp)
  .delete(protect, authorize("publisher", "admin"), deleteBootcamp);

router
  .route("/:id/photos")
  .put(protect, authorize("publisher", "admin"), uploadBootcampPhoto);

export default router;
