import express from "express";
import auth from "../../middlewares/auth.js";
import {
  getAllMovies,
  getMovieById,
  getMovieShowtimes,
} from "../../controllers/user/moviesController.js";

const router = express.Router();

const { isLoggedIn } = auth;

router.use(isLoggedIn);

/**
 * @swagger
 * /api/movies:
 *   get:
 *     summary: Get all movies with optional filtering
 *     tags: [User Movies]
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
 * /api/movies/{id}:
 *   get:
 *     summary: Get movie by ID
 *     tags: [User Movies]
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
 * /api/movies/{id}/showtimes:
 *   get:
 *     summary: Get showtimes for a specific movie
 *     tags: [User Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of showtimes
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
 *                   example: 3
 *                 data:
 *                   type: object
 *                   properties:
 *                     showtimes:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Showtime'
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Server error
 */
router.get("/:id/showtimes", getMovieShowtimes);

export default router;
