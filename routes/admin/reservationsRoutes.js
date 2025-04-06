import { Router } from 'express';
const router = Router();

import auth from '../../middlewares/auth.js';
const { isLoggedIn, isAdmin } = auth;

// Controller placeholders
// import { getAllReservations, getReservationStats } from '../../controllers/admin/reservationsController';

// Get all reservations
router.get('/', isLoggedIn, isAdmin, async (req, res) => { // getAllReservations

}
    
);

// Get reservation statistics (capacity, revenue, etc.)
router.get('/stats', isLoggedIn, isAdmin, 
    getReservationStats
);

export default router;
