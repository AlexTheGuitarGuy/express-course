import { Router } from "express";
import { getMe, login, register } from "../controllers/auth.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/me").get(protect, getMe);

export default router;
