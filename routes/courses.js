import {
  getCourses,
  getCourse,
  postCourse,
  putCourse,
  deleteCourse,
} from "../controllers/courses.js";
import { Router } from "express";
import advancedResults from "../middleware/advancedResults.js";
import Course from "../models/Course.js";
import { authorize, protect } from "../middleware/auth.js";

const router = Router({ mergeParams: true });

router
  .route("/")
  .get(
    advancedResults(Course, {
      path: "bootcamp",
      select: "name description",
    }),
    getCourses
  )
  .post(protect, authorize("publisher", "admin"), postCourse);

router
  .route("/:id")
  .get(getCourse)
  .put(protect, authorize("publisher", "admin"), putCourse)
  .delete(protect, authorize("publisher", "admin"), deleteCourse);

export default router;
