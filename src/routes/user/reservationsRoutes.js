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

/**
 * @swagger
 * /api/reservations:
 *   get:
 *     summary: Get user's own reservations
 *     tags: [User Reservations]
 *     responses:
 *       200:
 *         description: List of user's reservations
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
 *                     reservations:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Reservation'
 *       500:
 *         description: Server error
 */
router.get("/", getUserReservations);

/**
 * @swagger
 * /api/reservations:
 *   post:
 *     summary: Create a new reservation
 *     tags: [User Reservations]
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
 *                 description: ID of the showtime to reserve
 *               seatNumber:
 *                 type: string
 *                 description: Seat number to reserve
 *     responses:
 *       201:
 *         description: Reservation created successfully
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
 *         description: Invalid input or seat already taken
 *       404:
 *         description: Showtime not found
 *       500:
 *         description: Server error
 */
router.post("/", createReservation);

/**
 * @swagger
 * /api/reservations/{id}:
 *   delete:
 *     summary: Cancel own reservation
 *     tags: [User Reservations]
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
 *       400:
 *         description: Cannot cancel a booked reservation
 *       500:
 *         description: Server error
 */
router.delete("/:id", cancelReservation);

/**
 * @swagger
 * /api/reservations/{id}/pay:
 *   post:
 *     summary: Pay for reservation
 *     tags: [User Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment successful
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
 *       404:
 *         description: Reservation not found
 *       400:
 *         description: Only reserved seats can be paid for
 *       500:
 *         description: Server error
 */
router.post("/:id/pay", payReservation);

export default router;
