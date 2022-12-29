import { Router } from "express";

import {
  deleteReview,
  getReview,
  getReviews,
  postReview,
  putReview,
} from "../controllers/reviews.js";
import advancedResults from "../middleware/advancedResults.js";
import Review from "../models/Review.js";
import { authorize, protect } from "../middleware/auth.js";

const router = Router({ mergeParams: true });

router
  .route("/")
  .get(
    advancedResults(Review, {
      path: "bootcamp",
      select: "name description",
    }),
    getReviews
  )
  .post(protect, authorize("user", "admin"), postReview);

router
  .route("/:id")
  .get(getReview)
  .put(protect, authorize("user", "admin"), putReview)
  .delete(protect, authorize("user", "admin"), deleteReview);

export default router;
