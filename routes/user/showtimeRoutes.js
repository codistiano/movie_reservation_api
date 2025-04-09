import { Router } from "express";
const router = Router();
import auth from "../../middlewares/auth.js";
const { isLoggedIn } = auth;

// Importing controllers
import {
  getAllShowtimes,
  getShowtimeById,
  reserveSeat,
  cancelReservation,
} from "../../controllers/user/showtimesController.js";

// All routes are protected by isLoggedIn middleware
router.use(isLoggedIn);

// Get all showtimes
router.get("/", getAllShowtimes);

// Get showtime by ID
router.get("/:id", getShowtimeById);

// Reserve a seat
router.post("/reserve", reserveSeat);

// Cancel reservation
router.delete("/reservations/:id", cancelReservation);

export default router;
