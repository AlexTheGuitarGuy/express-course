import { Router } from "express";
import {
  getMe,
  login,
  register,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/me").get(protect, getMe);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:resetToken").post(resetPassword);

export default router;
