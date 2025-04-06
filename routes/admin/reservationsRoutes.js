import { Router } from 'express';
const router = Router();

import auth from '../../middlewares/auth.js';
const { isLoggedIn, isAdmin } = auth;

// Import db Models for testing
import Reservation from '../../models/Reservation.js';

// Controller placeholders
import { getAllReservations, getReservationById } from '../../controllers/admin/reservationsController.js';

// All routes are protected for admins only
router.use(isLoggedIn, isAdmin);

router.get('/', getAllReservations);

// Get a single reservation by ID
router.get('/:id', getReservationById );

// Get reservation statistics (capacity, revenue, etc.)

export default router;
