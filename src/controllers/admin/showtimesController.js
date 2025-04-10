import Showtime from "../../models/Showtime.js";
import Movie from "../../models/Movie.js";
import generateSeats from "../../utils/seatGenerator.js";
import { showtimeSchema } from "../../middlewares/validation.js";
import {
  AppError,
  NotFoundError,
  ValidationError,
} from "../../middlewares/errorHandler.js";

// Controllers for showtime Routes
export const getAllShowtimes = async (req, res, next) => {
  try {
    const showtimes = await Showtime.find({})
      .populate("movie", "title duration")
      .sort({ date: 1, startTime: 1 })
      .select("-seats"); // Exclude the seats array to reduce response size

    // Transform the showtimes to include only necessary seat information
    const transformedShowtimes = showtimes.map((showtime) => {
      const showtimeObj = showtime.toObject();
      return {
        ...showtimeObj,
        seatInfo: {
          totalSeats: showtime.totalSeats,
          availableSeats: showtime.availableSeats,
          reservedSeats: showtime.reservedSeats,
          bookedSeats: showtime.bookedSeats,
        },
      };
    });

    res.status(200).json({
      status: "success",
      results: transformedShowtimes.length,
      data: { showtimes: transformedShowtimes },
    });
  } catch (error) {
    console.error("Error in getAllShowtimes:", error);
    next(new AppError("Error fetching showtimes", 500));
  }
};

export const getShowtime = async (req, res, next) => {
  try {
    const showtime = await Showtime.findById(req.params.id).populate(
      "movie",
      "title duration genre price"
    );

    if (!showtime) {
      return next(new NotFoundError("Showtime not found"));
    }

    // Get seat statistics
    const availableSeats = showtime.getAvailableSeats();
    const reservedSeats = showtime.getReservedSeats();
    const bookedSeats = showtime.getBookedSeats();

    res.status(200).json({
      status: "success",
      data: {
        showtime,
        seatMap: showtime.seatMap,
        statistics: {
          totalSeats: showtime.totalSeats,
          availableSeats: availableSeats.length,
          reservedSeats: reservedSeats.length,
          bookedSeats: bookedSeats.length,
          revenue: showtime.revenue,
        },
      },
    });
  } catch (error) {
    next(new AppError("Error fetching showtime", 500));
  }
};

export const createShowtime = async (req, res, next) => {
  try {
    // Validate request body
    const { error } = showtimeSchema.validate(req.body);
    if (error) {
      return next(new ValidationError(error.details[0].message));
    }

    const { movie, date, startTime, rows = 5, seatsPerRow = 10 } = req.body;

    // Fetch movie by ID to get the duration and title
    const movieData = await Movie.findById(movie);
    if (!movieData) {
      return next(new NotFoundError("Movie not found"));
    }

    // Calculate endTime based on startTime and movie duration
    const durationInMilliseconds = movieData.duration * 60 * 1000;
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const convertedStartTime = new Date(date);
    convertedStartTime.setHours(startHour, startMinute, 0, 0);

    const convertedEndTime = new Date(
      convertedStartTime.getTime() + durationInMilliseconds
    );
    const endHour = String(convertedEndTime.getHours()).padStart(2, "0");
    const endMinute = String(convertedEndTime.getMinutes()).padStart(2, "0");
    const endTime = `${endHour}:${endMinute}`;

    // Find existing showtimes on the same date
    const existingShowtimes = await Showtime.find({ date });

    // Check for time conflicts
    for (const existingShowtime of existingShowtimes) {
      const existingStart = new Date(existingShowtime.startTime);
      const existingEnd = new Date(existingShowtime.endTime);

      if (
        (convertedStartTime >= existingStart &&
          convertedStartTime < existingEnd) ||
        (convertedEndTime > existingStart && convertedEndTime <= existingEnd) ||
        (convertedStartTime <= existingStart && convertedEndTime >= existingEnd)
      ) {
        return next(
          new ValidationError("Time slot conflict with existing showtime")
        );
      }
    }

    // Generate seats for the showtime
    const seats = generateSeats(rows, seatsPerRow);
    const totalSeats = seats.length;

    const newShowtime = new Showtime({
      movie,
      movieTitle: movieData.title,
      date,
      startTime,
      endTime,
      seats,
      seatLayout: {
        rows,
        seatsPerRow,
      },
      totalSeats,
      availableSeats: totalSeats,
      reservedSeats: 0,
      bookedSeats: 0,
      revenue: 0,
    });

    await newShowtime.save();

    res.status(201).json({
      status: "success",
      data: {
        showtime: newShowtime,
        seatMap: newShowtime.seatMap, // Virtual property for frontend
      },
    });
  } catch (error) {
    console.log(error.message);
    next(new AppError("Error creating showtime", 500));
  }
};

export const updateShowtime = async (req, res, next) => {
  try {
    const { error } = showtimeSchema.validate(req.body);
    if (error) {
      return next(new ValidationError(error.details[0].message));
    }

    const showtime = await Showtime.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!showtime) {
      return next(new NotFoundError("Showtime not found"));
    }

    res.status(200).json({
      status: "success",
      data: { showtime },
    });
  } catch (error) {
    next(new AppError("Error updating showtime", 500));
  }
};

export const deleteShowtime = async (req, res, next) => {
  try {
    const showtime = await Showtime.findByIdAndDelete(req.params.id);

    if (!showtime) {
      return next(new NotFoundError("Showtime not found"));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(new AppError("Error deleting showtime", 500));
  }
};
