import User from "../../models/User.js";
import Booking from "../../models/Booking.js";
import Review from "../../models/Review.js";
import AppError from "../../utils/AppError.js";
import bcrypt from "bcryptjs";

// Get user profile
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    res.status(200).json({
      status: "success",
      data: { user },
    });
  } catch (error) {
    next(new AppError("Error fetching profile", 500));
  }
};

// Update user profile
export const updateProfile = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;

    // Check if email is already taken by another user
    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return next(new AppError("Email is already taken", 400));
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email, phone },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({
      status: "success",
      data: { user },
    });
  } catch (error) {
    next(new AppError("Error updating profile", 500));
  }
};

// Change password
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validate required fields
    if (!currentPassword || !newPassword) {
      return next(new AppError("Please provide current and new password", 400));
    }

    // Get user with password
    const user = await User.findById(req.user._id).select("+password");

    // Check if current password is correct
    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordCorrect) {
      return next(new AppError("Current password is incorrect", 401));
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Password updated successfully",
    });
  } catch (error) {
    next(new AppError("Error changing password", 500));
  }
};

// Get user's bookings
export const getBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("showtime")
      .populate("movie")
      .sort("-createdAt");

    res.status(200).json({
      status: "success",
      results: bookings.length,
      data: { bookings },
    });
  } catch (error) {
    next(new AppError("Error fetching bookings", 500));
  }
};

// Get user's reviews
export const getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .populate("movie")
      .sort("-createdAt");

    res.status(200).json({
      status: "success",
      results: reviews.length,
      data: { reviews },
    });
  } catch (error) {
    next(new AppError("Error fetching reviews", 500));
  }
};
