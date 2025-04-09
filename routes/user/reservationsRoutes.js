import { Router } from "express";
const router = Router();
import auth from "../../middlewares/auth.js";
const { isLoggedIn } = auth;
import {
  getUserReservations,
  createReservation,
  cancelReservation,
  payReservation,
} from "../../controllers/user/reservationsController.js";

// All routes require user authentication
router.use(isLoggedIn);

// Get user's own reservations
router.get("/", getUserReservations);

// Create a new reservation
router.post("/", createReservation);

// Cancel own reservation
router.delete("/:id", cancelReservation);

// Pay for reservation
router.post("/:id/pay", payReservation);

export default router;
