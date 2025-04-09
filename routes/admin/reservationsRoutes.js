import { Router } from "express";
const router = Router();

import auth from "../../middlewares/auth.js";
const { isLoggedIn, isAdmin } = auth;

// Controller placeholders
import {
  getAllReservations,
  getReservationById,
  cancelReservation,
  getReservationsSummary,
  getDailyReservations,
} from "../../controllers/admin/reservationsController.js";

// All routes are protected for admins only
router.use(isLoggedIn, isAdmin);

// Get all reservations with optional filters
router.get("/", getAllReservations);

// Get a single reservation by ID
router.get("/:id", getReservationById);

// Cancel any reservation
router.delete("/:id", cancelReservation);

// Get reservation statistics
router.get("/reports/summary", getReservationsSummary);

// Get daily reservation report
router.get("/reports/daily", getDailyReservations);

export default router;
