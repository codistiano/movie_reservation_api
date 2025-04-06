import { Router } from 'express';
const router = Router();
import auth from '../../middlewares/auth.js';
const { isLoggedIn, isAdmin } = auth;

// Importing Controllers for the routes below
import { getTotalReport, getShowtimeReport } from '../../controllers/admin/reportsController.js';

router.use(isLoggedIn, isAdmin)

// Get Brief Report on Users, Movies, and Revenue
router.get('/', getTotalReport)

// Get a Report about a specific movie showtime
router.get('/:id', getShowtimeReport)


export default router;