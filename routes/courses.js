import {
  getCourses,
  getCourse,
  postCourse,
  putCourse,
  deleteCourse,
} from "../controllers/courses.js";
import express from "express";
import advancedResults from "../middleware/advancedResults.js";
import Course from "../models/Course.js";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(
    advancedResults(Course, {
      path: "bootcamp",
      select: "name description",
    }),
    getCourses
  )
  .post(postCourse);

router.route("/:id").get(getCourse).put(putCourse).delete(deleteCourse);

export default router;
