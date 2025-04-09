// Controllers for admin movies routes

import Movie from "../../models/Movie.js";
import { movieSchema } from "../../middlewares/validation.js";
import { validate } from "../../middlewares/validation.js";
import {
  NotFoundError,
  AppError,
  ValidationError,
} from "../../middlewares/errorHandler.js";
import Showtime from "../../models/Showtime.js";

export const getAllMovies = async (req, res, next) => {
  // View all movies
  try {
    // Build query based on filters
    const query = {};

    // Filter by genre if provided
    if (req.query.genre) {
      query.genre = req.query.genre;
    }

    // Filter by title if provided (case-insensitive search)
    if (req.query.title) {
      query.title = { $regex: req.query.title, $options: "i" };
    }

    // Get all matching movies
    const movies = await Movie.find(query).sort("-createdAt");

    res.status(200).json({
      status: "success",
      results: movies.length,
      data: { movies },
    });
  } catch (error) {
    next(new AppError("Error fetching movies", 500));
  }
};

export const getMovieById = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return next(new NotFoundError("Movie not found"));
    }

    res.status(200).json({
      status: "success",
      data: { movie },
    });
  } catch (error) {
    next(new AppError("Error fetching movie", 500));
  }
};

export const createMovie = async (req, res, next) => {
  // Create a new movie
  try {
    // Validate request body
    const { error } = movieSchema.validate(req.body);
    if (error) {
      return next(new ValidationError(error.details[0].message));
    }

    // Check if movie with same title already exists
    const existingMovie = await Movie.findOne({ title: req.body.title });
    if (existingMovie) {
      return next(
        new ValidationError("A movie with this title already exists")
      );
    }

    const movie = new Movie(req.body);
    await movie.save();

    res.status(201).json({
      status: "success",
      data: { movie },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      next(new ValidationError(error.message));
    } else {
      next(new AppError("Error creating movie", 500));
    }
  }
};

export const updateMovie = async (req, res, next) => {
  // Update a movie
  try {
    // Validate request body
    const { error } = movieSchema.validate(req.body);
    if (error) {
      return next(new ValidationError(error.details[0].message));
    }

    // Check if movie exists
    const existingMovie = await Movie.findById(req.params.id);
    if (!existingMovie) {
      return next(new NotFoundError("Movie not found"));
    }

    // Check if new title conflicts with existing movie
    if (req.body.title && req.body.title !== existingMovie.title) {
      const titleExists = await Movie.findOne({ title: req.body.title });
      if (titleExists) {
        return next(
          new ValidationError("A movie with this title already exists")
        );
      }
    }

    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: { movie },
    });
  } catch (error) {
    next(new AppError("Error updating movie", 500));
  }
};

export const deleteMovie = async (req, res, next) => {
  // Delete a movie
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return next(new NotFoundError("Movie not found"));
    }

    // Check if movie has any associated showtimes
    const hasShowtimes = await Showtime.exists({ movie: req.params.id });
    if (hasShowtimes) {
      return next(
        new ValidationError("Cannot delete movie with existing showtimes")
      );
    }

    await movie.deleteOne();

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(new AppError("Error deleting movie", 500));
  }
};
