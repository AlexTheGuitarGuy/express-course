import express from "express";
import {
  getBitch,
  getBitches,
  postBitch,
  putBitch,
  deleteBitch,
} from "../controllers/bitches.js";

const router = express.Router();

router.route("/").get(getBitches).post(postBitch);

router.route(`/:id`).get(getBitch).put(putBitch).delete(deleteBitch);

export default router;
