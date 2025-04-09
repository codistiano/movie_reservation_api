import { Router } from "express";
const router = Router();
import auth from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validation.js";
import { showtimeSchema } from "../../middlewares/validation.js";
const { isLoggedIn, isAdmin } = auth;
import {
  createShowtime,
  updateShowtime,
  deleteShowtime,
  getAllShowtimes,
  getShowtime,
} from "../../controllers/admin/showtimesController.js";

// All routes are protected for admins only
router.use(isLoggedIn, isAdmin);

/**
 * @swagger
 * /api/admin/showtimes:
 *   get:
 *     summary: Get all showtimes
 *     tags: [Admin Showtimes]
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
 *                   example: 5
 *                 data:
 *                   type: object
 *                   properties:
 *                     showtimes:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Showtime'
 *       500:
 *         description: Server error
 */
router.get("/", getAllShowtimes);

/**
 * @swagger
 * /api/admin/showtimes/{id}:
 *   get:
 *     summary: Get showtime by ID
 *     tags: [Admin Showtimes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Showtime details
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
 *                     showtime:
 *                       $ref: '#/components/schemas/Showtime'
 *                     seatMap:
 *                       type: object
 *                     statistics:
 *                       type: object
 *                       properties:
 *                         totalSeats:
 *                           type: number
 *                         availableSeats:
 *                           type: number
 *                         reservedSeats:
 *                           type: number
 *                         bookedSeats:
 *                           type: number
 *                         revenue:
 *                           type: number
 *       404:
 *         description: Showtime not found
 *       500:
 *         description: Server error
 */
router.get("/:id", getShowtime);

/**
 * @swagger
 * /api/admin/showtimes:
 *   post:
 *     summary: Create a new showtime
 *     tags: [Admin Showtimes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Showtime'
 *     responses:
 *       201:
 *         description: Showtime created successfully
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
 *                     showtime:
 *                       $ref: '#/components/schemas/Showtime'
 *                     seatMap:
 *                       type: object
 *       400:
 *         description: Validation error or time slot conflict
 *       500:
 *         description: Server error
 */
router.post("/", validate(showtimeSchema), createShowtime);

/**
 * @swagger
 * /api/admin/showtimes/{id}:
 *   put:
 *     summary: Update a showtime
 *     tags: [Admin Showtimes]
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
 *             $ref: '#/components/schemas/Showtime'
 *     responses:
 *       200:
 *         description: Showtime updated successfully
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
 *                     showtime:
 *                       $ref: '#/components/schemas/Showtime'
 *       404:
 *         description: Showtime not found
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.put("/:id", validate(showtimeSchema), updateShowtime);

/**
 * @swagger
 * /api/admin/showtimes/{id}:
 *   delete:
 *     summary: Delete a showtime
 *     tags: [Admin Showtimes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Showtime deleted successfully
 *       404:
 *         description: Showtime not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", deleteShowtime);

export default router;
