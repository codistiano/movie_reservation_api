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

/**
 * @swagger
 * /api/admin/reservations:
 *   get:
 *     summary: Get all reservations with optional filters
 *     tags: [Admin Reservations]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, cancelled]
 *         description: Filter by reservation status
 *       - in: query
 *         name: movie
 *         schema:
 *           type: string
 *         description: Filter by movie ID
 *     responses:
 *       200:
 *         description: List of reservations
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
router.get("/", getAllReservations);

/**
 * @swagger
 * /api/admin/reservations/{id}:
 *   get:
 *     summary: Get reservation by ID
 *     tags: [Admin Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reservation details
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
 *       500:
 *         description: Server error
 */
router.get("/:id", getReservationById);

/**
 * @swagger
 * /api/admin/reservations/{id}:
 *   delete:
 *     summary: Cancel a reservation
 *     tags: [Admin Reservations]
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
router.delete("/:id", cancelReservation);

/**
 * @swagger
 * /api/admin/reservations/reports/summary:
 *   get:
 *     summary: Get reservation statistics summary
 *     tags: [Admin Reservations]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for summary. Defaults to 30 days ago.
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for summary. Defaults to today.
 *     responses:
 *       200:
 *         description: Reservation summary
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
 *                     dateRange:
 *                       type: object
 *                       properties:
 *                         startDate:
 *                           type: string
 *                           format: date
 *                         endDate:
 *                           type: string
 *                           format: date
 *                     summary:
 *                       type: object
 *                       properties:
 *                         totalReservations:
 *                           type: number
 *                         totalRevenue:
 *                           type: number
 *                         statusCounts:
 *                           type: object
 *                     topMovies:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           revenue:
 *                             type: number
 *                           tickets:
 *                             type: number
 *       500:
 *         description: Server error
 */
router.get("/reports/summary", getReservationsSummary);

/**
 * @swagger
 * /api/admin/reservations/reports/daily:
 *   get:
 *     summary: Get daily reservation report
 *     tags: [Admin Reservations]
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Date for daily report. Defaults to today.
 *     responses:
 *       200:
 *         description: Daily reservation report
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
 *                     date:
 *                       type: string
 *                       format: date
 *                     summary:
 *                       type: object
 *                       properties:
 *                         totalReservations:
 *                           type: number
 *                         totalRevenue:
 *                           type: number
 *                         statusCounts:
 *                           type: object
 *                     showtimeStats:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           movie:
 *                             type: string
 *                           startTime:
 *                             type: string
 *                           reservations:
 *                             type: number
 *                           revenue:
 *                             type: number
 *       500:
 *         description: Server error
 */
router.get("/reports/daily", getDailyReservations);

export default router;
