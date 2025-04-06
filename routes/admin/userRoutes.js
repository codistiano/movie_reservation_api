import { Router } from 'express';
const router = Router();

import User from '../../models/User.js';

import auth from '../../middlewares/auth.js';
const { isLoggedIn, isAdmin } = auth;
// Controller placeholders
import { getAllUsers, promoteUserToAdmin, demoteAdminToUser } from '../../controllers/admin/usersController.js';

// Get all users (admin only)
router.get('/', isLoggedIn, isAdmin, getAllUsers);

// Promote a user to admin
router.put('/promote/:id', isLoggedIn, isAdmin, promoteUserToAdmin);

// Demote an admin to user
router.put('/demote/:id', isLoggedIn, isAdmin, demoteAdminToUser)

export default router;
