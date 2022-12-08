import express from "express";
import {
  getBootcamp,
  getBootcamps,
  postBootcamp,
  putBootcamp,
  deleteBootcamp,
} from "../controllers/bootcamps.js";

const router = express.Router();

router.route("/").get(getBootcamps).post(postBootcamp);

router.route(`/:id`).get(getBootcamp).put(putBootcamp).delete(deleteBootcamp);

export default router;
