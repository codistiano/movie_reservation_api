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

/**
 * @swagger
 * /api/admin/movies:
 *   get:
 *     summary: Get all movies with optional filtering
 *     tags: [Admin Movies]
 *     parameters:
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *           enum: [Action, Comedy, Drama, Horror, Sci-Fi, Thriller]
 *         description: Filter by genre
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter by title (case-insensitive)
 *     responses:
 *       200:
 *         description: List of movies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 results:
 *                   type: number
 *                   example: 5
 *                 data:
 *                   type: object
 *                   properties:
 *                     movies:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Movie'
 *       500:
 *         description: Server error
 */
router.get("/", getAllMovies);

/**
 * @swagger
 * /api/admin/movies/{id}:
 *   get:
 *     summary: Get movie by ID
 *     tags: [Admin Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Movie details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     movie:
 *                       $ref: '#/components/schemas/Movie'
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Server error
 */
router.get("/:id", getMovieById);

/**
 * @swagger
 * /api/admin/movies:
 *   post:
 *     summary: Create a new movie
 *     tags: [Admin Movies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Movie'
 *     responses:
 *       201:
 *         description: Movie created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     movie:
 *                       $ref: '#/components/schemas/Movie'
 *       400:
 *         description: Validation error or duplicate title
 *       500:
 *         description: Server error
 */
router.post("/", validate(movieSchema), createMovie);

/**
 * @swagger
 * /api/admin/movies/{id}:
 *   put:
 *     summary: Update a movie
 *     tags: [Admin Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Movie'
 *     responses:
 *       200:
 *         description: Movie updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     movie:
 *                       $ref: '#/components/schemas/Movie'
 *       404:
 *         description: Movie not found
 *       400:
 *         description: Validation error or duplicate title
 *       500:
 *         description: Server error
 */
router.put("/:id", validate(movieSchema), updateMovie);

/**
 * @swagger
 * /api/admin/movies/{id}:
 *   delete:
 *     summary: Delete a movie
 *     tags: [Admin Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Movie deleted successfully
 *       404:
 *         description: Movie not found
 *       400:
 *         description: Movie has associated showtimes
 *       500:
 *         description: Server error
 */
router.delete("/:id", deleteMovie);

export default router;
