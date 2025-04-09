import express from "express";
import { isLoggedIn } from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validation.js";
import { movieSchema } from "../../middlewares/validation.js";
import {
  getAllMovies,
  getMovieById,
  getMovieShowtimes,
  getMovieReviews,
} from "../../controllers/user/moviesController.js";

const router = express.Router();

// Get all movies (with optional filters)
router.get("/", getAllMovies);

// Get movie by ID
router.get("/:id", getMovieById);

// Get showtimes for a specific movie
router.get("/:id/showtimes", getMovieShowtimes);

// Get reviews for a specific movie
router.get("/:id/reviews", getMovieReviews);

export default router;
