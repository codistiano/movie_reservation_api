import Showtime from "../../models/Showtime.js";
import Movie from "../../models/Movie.js";
import User from "../../models/User.js";
import Reservation from "../../models/Reservation.js";
import { AppError } from "../../middlewares/errorHandler.js";

export const getTotalReport = async (req, res, next) => {
  try {
    // Get date range from query params (default to last 30 days)
    const startDate = req.query.startDate
      ? new Date(req.query.startDate)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = req.query.endDate
      ? new Date(req.query.endDate)
      : new Date();

    // Get total revenue
    const reservations = await Reservation.find({
      status: "booked",
      createdAt: { $gte: startDate, $lte: endDate },
    }).populate("showtime");

    const totalRevenue = reservations.reduce(
      (sum, reservation) => sum + reservation.price,
      0
    );

    // Get total tickets sold
    const totalTickets = reservations.length;

    // Get total shows
    const totalShows = await Showtime.countDocuments({
      date: { $gte: startDate, $lte: endDate },
    });

    // Get total movies
    const totalMovies = await Movie.countDocuments();

    // Get revenue by genre
    const revenueByGenre = await Reservation.aggregate([
      {
        $match: {
          status: "booked",
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $lookup: {
          from: "showtimes",
          localField: "showtime",
          foreignField: "_id",
          as: "showtime",
        },
      },
      { $unwind: "$showtime" },
      {
        $lookup: {
          from: "movies",
          localField: "showtime.movie",
          foreignField: "_id",
          as: "movie",
        },
      },
      { $unwind: "$movie" },
      {
        $group: {
          _id: "$movie.genre",
          revenue: { $sum: "$price" },
          tickets: { $sum: 1 },
        },
      },
    ]);

    // Get top performing movies
    const topMovies = await Reservation.aggregate([
      {
        $match: {
          status: "booked",
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $lookup: {
          from: "showtimes",
          localField: "showtime",
          foreignField: "_id",
          as: "showtime",
        },
      },
      { $unwind: "$showtime" },
      {
        $lookup: {
          from: "movies",
          localField: "showtime.movie",
          foreignField: "_id",
          as: "movie",
        },
      },
      { $unwind: "$movie" },
      {
        $group: {
          _id: "$movie.title",
          revenue: { $sum: "$price" },
          tickets: { $sum: 1 },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
    ]);

    res.status(200).json({
      status: "success",
      data: {
        summary: {
          totalRevenue,
          totalTickets,
          totalShows,
          totalMovies,
          dateRange: {
            start: startDate,
            end: endDate,
          },
        },
        revenueByGenre,
        topMovies,
      },
    });
  } catch (error) {
    next(new AppError("Error generating total report", 500));
  }
};

export const getShowtimeReport = async (req, res, next) => {
  try {
    const { showtimeId } = req.params;

    // Get showtime details
    const showtime = await Showtime.findById(showtimeId).populate(
      "movie",
      "title genre duration"
    );

    if (!showtime) {
      return next(new AppError("Showtime not found", 404));
    }

    // Get all reservations for this showtime
    const reservations = await Reservation.find({
      showtime: showtimeId,
      status: "booked",
    });

    // Calculate revenue and occupancy
    const totalRevenue = reservations.reduce(
      (sum, reservation) => sum + reservation.price,
      0
    );
    const totalSeats = showtime.seats.length;
    const occupiedSeats = reservations.length;
    const occupancyRate = (occupiedSeats / totalSeats) * 100;

    // Get seat distribution
    const seatDistribution = showtime.seats.reduce((acc, seat) => {
      acc[seat.status] = (acc[seat.status] || 0) + 1;
      return acc;
    }, {});

    res.status(200).json({
      status: "success",
      data: {
        showtime: {
          movie: showtime.movie,
          date: showtime.date,
          startTime: showtime.startTime,
          endTime: showtime.endTime,
        },
        revenue: {
          total: totalRevenue,
          averageTicketPrice: totalRevenue / occupiedSeats || 0,
        },
        occupancy: {
          totalSeats,
          occupiedSeats,
          availableSeats: totalSeats - occupiedSeats,
          occupancyRate: occupancyRate.toFixed(2),
        },
        seatDistribution,
      },
    });
  } catch (error) {
    next(new AppError("Error generating showtime report", 500));
  }
};

export const getMovieReport = async (req, res, next) => {
  try {
    const { movieId } = req.params;

    // Get movie details
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return next(new AppError("Movie not found", 404));
    }

    // Get all showtimes for this movie
    const showtimes = await Showtime.find({ movie: movieId });

    // Get all reservations for these showtimes
    const reservations = await Reservation.find({
      showtime: { $in: showtimes.map((s) => s._id) },
      status: "booked",
    });

    // Calculate total revenue and tickets
    const totalRevenue = reservations.reduce(
      (sum, reservation) => sum + reservation.price,
      0
    );
    const totalTickets = reservations.length;

    // Calculate average occupancy rate
    const totalSeats = showtimes.reduce(
      (sum, showtime) => sum + showtime.seats.length,
      0
    );
    const occupancyRate = (totalTickets / totalSeats) * 100;

    // Get revenue by showtime
    const revenueByShowtime = await Reservation.aggregate([
      {
        $match: {
          showtime: { $in: showtimes.map((s) => s._id) },
          status: "booked",
        },
      },
      {
        $group: {
          _id: "$showtime",
          revenue: { $sum: "$price" },
          tickets: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "showtimes",
          localField: "_id",
          foreignField: "_id",
          as: "showtime",
        },
      },
      { $unwind: "$showtime" },
      {
        $project: {
          date: "$showtime.date",
          startTime: "$showtime.startTime",
          revenue: 1,
          tickets: 1,
        },
      },
      { $sort: { date: 1 } },
    ]);

    res.status(200).json({
      status: "success",
      data: {
        movie: {
          title: movie.title,
          genre: movie.genre,
          duration: movie.duration,
        },
        summary: {
          totalRevenue,
          totalTickets,
          totalShowtimes: showtimes.length,
          averageOccupancyRate: occupancyRate.toFixed(2),
        },
        revenueByShowtime,
      },
    });
  } catch (error) {
    next(new AppError("Error generating movie report", 500));
  }
};

export const getDailyReport = async (req, res, next) => {
  try {
    // Get date from query params (default to today)
    const date = req.query.date ? new Date(req.query.date) : new Date();
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    // Get all showtimes for the day
    const showtimes = await Showtime.find({
      date: { $gte: startOfDay, $lte: endOfDay },
    }).populate("movie", "title genre");

    // Get all reservations for these showtimes
    const reservations = await Reservation.find({
      showtime: { $in: showtimes.map((s) => s._id) },
      status: "booked",
    });

    // Calculate total revenue and tickets
    const totalRevenue = reservations.reduce(
      (sum, reservation) => sum + reservation.price,
      0
    );
    const totalTickets = reservations.length;

    // Get revenue by movie
    const revenueByMovie = await Reservation.aggregate([
      {
        $match: {
          showtime: { $in: showtimes.map((s) => s._id) },
          status: "booked",
        },
      },
      {
        $lookup: {
          from: "showtimes",
          localField: "showtime",
          foreignField: "_id",
          as: "showtime",
        },
      },
      { $unwind: "$showtime" },
      {
        $lookup: {
          from: "movies",
          localField: "showtime.movie",
          foreignField: "_id",
          as: "movie",
        },
      },
      { $unwind: "$movie" },
      {
        $group: {
          _id: "$movie.title",
          revenue: { $sum: "$price" },
          tickets: { $sum: 1 },
        },
      },
      { $sort: { revenue: -1 } },
    ]);

    res.status(200).json({
      status: "success",
      data: {
        date: startOfDay,
        summary: {
          totalRevenue,
          totalTickets,
          totalShowtimes: showtimes.length,
        },
        revenueByMovie,
      },
    });
  } catch (error) {
    next(new AppError("Error generating daily report", 500));
  }
};
