import express from "express";
import auth from "../../middlewares/auth.js";
import {
  getAllMovies,
  getMovieById,
  getMovieShowtimes,
} from "../../controllers/user/moviesController.js";

const router = express.Router();

const { isLoggedIn } = auth;

router.use(isLoggedIn)

// Get all movies (with optional filters)
router.get("/", getAllMovies);

// Get movie by ID
router.get("/:id", getMovieById);

// Get showtimes for a specific movie
router.get("/:id/showtimes", getMovieShowtimes);

export default router;
