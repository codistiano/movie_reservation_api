import { Router } from "express";
const router = Router();
import auth from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validation.js";
import { movieSchema } from "../../middlewares/validation.js";
const { isLoggedIn, isAdmin } = auth;
import {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
} from "../../controllers/admin/moviesController.js";

// All routes are protected for admins only
router.use(isLoggedIn, isAdmin);

// Get all movies with pagination, sorting, and filtering
router.get("/", getAllMovies);

// Get movie by ID
router.get("/:id", getMovieById);

// Create new movie
router.post("/", validate(movieSchema), createMovie);

// Update movie
router.put("/:id", validate(movieSchema), updateMovie);

// Delete movie
router.delete("/:id", deleteMovie);

export default router;
