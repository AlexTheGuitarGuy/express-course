import { Router } from "express";
import {
  getMe,
  login,
  register,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
  logout,
} from "../controllers/auth.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/me").get(protect, getMe);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:resetToken").post(resetPassword);
router.route("/update-details").put(protect, updateDetails);
router.route("/update-password").put(protect, updatePassword);

export default router;
