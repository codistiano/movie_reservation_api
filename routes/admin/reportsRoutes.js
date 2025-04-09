import express from "express";
import {
  getTotalReport,
  getShowtimeReport,
  getMovieReport,
  getDailyReport,
} from "../../controllers/admin/reportsController.js";
import auth from "../../middlewares/auth.js";

const router = express.Router();

const { isLoggedIn, isAdmin } = auth;
router.use(isLoggedIn, isAdmin);

// Get overall statistics
router.get("/total", getTotalReport);

// Get specific showtime report
router.get(
  "/showtime/:showtimeId",
  getShowtimeReport
);

// Get specific movie report
router.get("/movie/:movieId", getMovieReport);

// Get daily report
router.get("/daily", getDailyReport);

export default router;
