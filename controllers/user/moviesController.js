import Movie from "../../models/Movie.js";
import Showtime from "../../models/Showtime.js";
import { AppError } from "../../middlewares/errorHandler.js";

// Get all movies (with optional filters)
export const getAllMovies = async (req, res, next) => {
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

// Get movie by ID
export const getMovieById = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return next(new AppError("Movie not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: { movie },
    });
  } catch (error) {
    next(new AppError("Error fetching movie", 500));
  }
};

// Get showtimes for a specific movie
export const getMovieShowtimes = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return next(new AppError("Movie not found", 404));
    }

    // Get showtimes for this movie
    const showtimes = await Showtime.find({ movie: req.params.id }).sort(
      "startTime"
    );

    res.status(200).json({
      status: "success",
      results: showtimes.length,
      data: { showtimes },
    });
  } catch (error) {
    next(new AppError("Error fetching showtimes", 500));
  }
};
