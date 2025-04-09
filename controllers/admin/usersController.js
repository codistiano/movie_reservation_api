// Controllers for admin users routes
import User from "../../models/User.js";
import {
  AppError,
  NotFoundError,
  ValidationError,
} from "../../middlewares/errorHandler.js";

export const getAllUsers = async (req, res, next) => {
  // Get all users
  try {
    const users = await User.find({}).select("-password");

    res.status(200).json({
      status: "success",
      results: users.length,
      data: {
        users: users.map((user) => ({
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          reservationsHistory: user.reservationsHistory,
        })),
      },
    });
  } catch (error) {
    next(new AppError("Error fetching users", 500));
  }
};

export const promoteUserToAdmin = async (req, res, next) => {
  // promote user to admin
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return next(new NotFoundError("User not found"));
    }

    if (user.role === "admin") {
      return next(new ValidationError("This user is already an admin"));
    }

    user.role = "admin";
    await user.save();

    res.status(200).json({
      status: "success",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(new AppError("Error promoting user to admin", 500));
  }
};

export const demoteAdminToUser = async (req, res, next) => {
  // demote admin to user
  try {
    const { id } = req.params;

    // Prevent self-demotion
    if (req.user.id === id) {
      return next(new ValidationError("You cannot demote yourself"));
    }

    const user = await User.findById(id);
    if (!user) {
      return next(new NotFoundError("User not found"));
    }

    if (user.role === "user") {
      return next(new ValidationError("This user is already a regular user"));
    }

    user.role = "user";
    await user.save();

    res.status(200).json({
      status: "success",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(new AppError("Error demoting admin to user", 500));
  }
};
