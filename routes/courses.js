import {
  getCourses,
  getCourse,
  postCourse,
  putCourse,
  deleteCourse,
} from "../controllers/courses.js";
import express from "express";

const router = express.Router({ mergeParams: true });

router.route("/").get(getCourses).post(postCourse);

router.route("/:id").get(getCourse).put(putCourse).delete(deleteCourse);

export default router;
