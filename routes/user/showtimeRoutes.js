import { Router } from "express";
const router = Router();
import auth from "../../middlewares/auth.js";
const { isLoggedIn } = auth;

// Importing controllers
import { getAllShowtimes, getShowtimeById, reserveaSeat, cancelReservation } from "../../controllers/user/showtimesController.js";

// All routes are protected by isLoggedIn middleware
router.use(isLoggedIn);

// Showtimes routes
router.get("/", getAllShowtimes);

router.get("/:id", getShowtimeById);

router.post("/:id/reserve", reserveaSeat);

router.delete("/:id/cancel", cancelReservation);

export default router;
