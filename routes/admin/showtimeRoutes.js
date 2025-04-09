import { Router } from "express";
const router = Router();
import auth from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validation.js";
import { showtimeSchema } from "../../middlewares/validation.js";
const { isLoggedIn, isAdmin } = auth;
import {
  createShowtime,
  updateShowtime,
  deleteShowtime,
  getAllShowtimes,
  getShowtime,
} from "../../controllers/admin/showtimesController.js";

// All routes are protected for admins only
router.use(isLoggedIn, isAdmin);

router.get("/", getAllShowtimes);

router.get("/:id", getShowtime);

router.post("/", validate(showtimeSchema), createShowtime);

router.put("/:id", validate(showtimeSchema), updateShowtime);

router.delete("/:id", deleteShowtime);

export default router;
