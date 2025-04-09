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

/**
 * @swagger
 * /api/admin/reports/total:
 *   get:
 *     summary: Get overall statistics report
 *     tags: [Admin Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for report. Defaults to 30 days ago.
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for report. Defaults to today.
 *     responses:
 *       200:
 *         description: Overall statistics report
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
 *                     summary:
 *                       type: object
 *                       properties:
 *                         totalRevenue:
 *                           type: number
 *                         totalTickets:
 *                           type: number
 *                         totalShows:
 *                           type: number
 *                         totalMovies:
 *                           type: number
 *                         dateRange:
 *                           type: object
 *                           properties:
 *                             start:
 *                               type: string
 *                               format: date
 *                             end:
 *                               type: string
 *                               format: date
 *                     revenueByGenre:
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
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Server error
 */
router.get("/total", getTotalReport);

/**
 * @swagger
 * /api/admin/reports/showtime/{showtimeId}:
 *   get:
 *     summary: Get specific showtime report
 *     tags: [Admin Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: showtimeId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the showtime
 *     responses:
 *       200:
 *         description: Showtime report
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
 *                       type: object
 *                       properties:
 *                         movie:
 *                           $ref: '#/components/schemas/Movie'
 *                         date:
 *                           type: string
 *                           format: date
 *                         startTime:
 *                           type: string
 *                         endTime:
 *                           type: string
 *                     revenue:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: number
 *                         averageTicketPrice:
 *                           type: number
 *                     occupancy:
 *                       type: object
 *                       properties:
 *                         totalSeats:
 *                           type: number
 *                         occupiedSeats:
 *                           type: number
 *                         availableSeats:
 *                           type: number
 *                         occupancyRate:
 *                           type: string
 *                     seatDistribution:
 *                       type: object
 *       404:
 *         description: Showtime not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Server error
 */
router.get("/showtime/:showtimeId", getShowtimeReport);

/**
 * @swagger
 * /api/admin/reports/movie/{movieId}:
 *   get:
 *     summary: Get specific movie report
 *     tags: [Admin Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the movie
 *     responses:
 *       200:
 *         description: Movie report
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
 *                     summary:
 *                       type: object
 *                       properties:
 *                         totalRevenue:
 *                           type: number
 *                         totalTickets:
 *                           type: number
 *                         totalShowtimes:
 *                           type: number
 *                         averageOccupancyRate:
 *                           type: string
 *                     revenueByShowtime:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           date:
 *                             type: string
 *                             format: date
 *                           startTime:
 *                             type: string
 *                           revenue:
 *                             type: number
 *                           tickets:
 *                             type: number
 *       404:
 *         description: Movie not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Server error
 */
router.get("/movie/:movieId", getMovieReport);

/**
 * @swagger
 * /api/admin/reports/daily:
 *   get:
 *     summary: Get daily report
 *     tags: [Admin Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Date for daily report. Defaults to today.
 *     responses:
 *       200:
 *         description: Daily report
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
 *                         totalRevenue:
 *                           type: number
 *                         totalTickets:
 *                           type: number
 *                         totalShowtimes:
 *                           type: number
 *                     revenueByMovie:
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
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Server error
 */
router.get("/daily", getDailyReport);

export default router;
