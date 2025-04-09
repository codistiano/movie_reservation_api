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

/**
 * @swagger
 * /api/showtimes:
 *   get:
 *     summary: Get all showtimes
 *     tags: [User Showtimes]
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
 * /api/showtimes/{id}:
 *   get:
 *     summary: Get showtime by ID
 *     tags: [User Showtimes]
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
 *       404:
 *         description: Showtime not found
 *       500:
 *         description: Server error
 */
router.get("/:id", getShowtimeById);

/**
 * @swagger
 * /api/showtimes/reserve:
 *   post:
 *     summary: Reserve a seat for a showtime
 *     tags: [User Showtimes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - showtimeId
 *               - seatNumber
 *             properties:
 *               showtimeId:
 *                 type: string
 *               seatNumber:
 *                 type: string
 *     responses:
 *       201:
 *         description: Seat reserved successfully
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
 *                     reservation:
 *                       $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Invalid seat number or seat already taken
 *       404:
 *         description: Showtime not found
 *       500:
 *         description: Server error
 */
router.post("/reserve", reserveSeat);

/**
 * @swagger
 * /api/showtimes/reservations/{id}:
 *   delete:
 *     summary: Cancel a reservation
 *     tags: [User Showtimes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Reservation cancelled successfully
 *       404:
 *         description: Reservation not found
 *       500:
 *         description: Server error
 */
router.delete("/reservations/:id", cancelReservation);

export default router;
