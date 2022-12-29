import { Router } from "express";

import advancedResults from "../middleware/advancedResults.js";
import User from "../models/User.js";
import {
  deleteUser,
  getUser,
  getUsers,
  postUser,
  putUser,
} from "../controllers/users.js";
import { authorize, protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);
router.use(authorize("admin"));

router.route("/").get(advancedResults(User), getUsers).post(postUser);
router.route("/:id").get(getUser).put(putUser).delete(deleteUser);

export default router;
