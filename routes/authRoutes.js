import { Router } from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { validate } from "../middlewares/validation.js";
import { userSchema, loginSchema } from "../middlewares/validation.js";
import { AppError, ValidationError } from "../middlewares/errorHandler.js";

const router = Router();

// Sign-up route
router.post("/signup", validate(userSchema), async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(new ValidationError("User already exists"));
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    // Generate token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(201).json({
      status: "success",
      data: {
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        },
        token,
      },
    });
  } catch (error) {
    next(new AppError("Error creating user", 500));
  }
});

// Login route
router.post("/login", validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ValidationError("Invalid credentials"));
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return next(new ValidationError("Invalid credentials"));
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      status: "success",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        token,
      },
    });
  } catch (error) {
    next(new AppError("Error during login", 500));
  }
});

export default router;
