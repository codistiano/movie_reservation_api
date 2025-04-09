import { Router } from "express";
const router = Router();

import auth from "../../middlewares/auth.js";
const { isLoggedIn, isAdmin } = auth;

// Import controllers
import {
  getAllUsers,
  promoteUserToAdmin,
  demoteAdminToUser,
} from "../../controllers/admin/usersController.js";

// All routes are protected for admins only
router.use(isLoggedIn, isAdmin);

// Get all users
router.get("/", getAllUsers);

// Promote a user to admin
router.put("/promote/:id", promoteUserToAdmin);

// Demote an admin to user
router.put("/demote/:id", demoteAdminToUser);

export default router;
