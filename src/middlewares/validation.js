import Joi from "joi";

// Movie validation schema
export const movieSchema = Joi.object({
  title: Joi.string().required().min(2).max(100),
  description: Joi.string().required().min(10).max(1000),
  poster: Joi.string().uri().required(),
  genre: Joi.string()
    .required()
    .valid("Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Thriller"),
  duration: Joi.number().required().min(1).max(300), // Duration in minutes
});

// Showtime validation schema
export const showtimeSchema = Joi.object({
  movie: Joi.string().required().hex().length(24), // MongoDB ObjectId
  date: Joi.date().required().min("now"),
  startTime: Joi.string()
    .required()
    .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/), // HH:MM format
  seats: Joi.array().items(
    Joi.object({
      row: Joi.number().required().min(1).max(20),
      number: Joi.number().required().min(1).max(20),
      status: Joi.string().valid("available", "reserved", "booked").required(),
    })
  ),
});

// User validation schema
export const userSchema = Joi.object({
  name: Joi.string().required().min(2).max(50),
  email: Joi.string().required().email(),
  password: Joi.string().required().min(6).max(30),
});

// Login validation schema
export const loginSchema = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required(),
});

// Validation middleware
export const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      details: error.details.map((detail) => detail.message),
    });
  }
  next();
};
