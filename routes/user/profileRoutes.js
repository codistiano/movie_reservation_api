import express from "express";
import { isLoggedIn } from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validation.js";
import { userSchema } from "../../middlewares/validation.js";
import {
  getProfile,
  updateProfile,
  changePassword,
  getBookings,
  getReviews,
} from "../../controllers/user/profileController.js";

const router = express.Router();

// Get user profile
router.get("/", isLoggedIn, getProfile);

// Update user profile
router.patch("/", isLoggedIn, validate(userSchema), updateProfile);

// Change password
router.patch("/password", isLoggedIn, changePassword);

// Get user's bookings
router.get("/bookings", isLoggedIn, getBookings);

// Get user's reviews
router.get("/reviews", isLoggedIn, getReviews);

export default router;
