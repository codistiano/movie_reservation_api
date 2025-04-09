import express from "express";
import auth from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validation.js";
import { userSchema } from "../../middlewares/validation.js";
import {
  getProfile,
  updateProfile,
  changePassword,
  getReservations,
} from "../../controllers/user/profileController.js";

const router = express.Router();
const { isLoggedIn } = auth;

router.use(isLoggedIn)

// Get user profile
router.get("/", getProfile);

// Update user profile
router.patch("/", validate(userSchema), updateProfile);

// Change password
router.patch("/password", changePassword);

// Get user's bookings
router.get("/bookings", getReservations);

export default router;
