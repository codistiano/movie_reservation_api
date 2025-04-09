import Reservation from "../../models/Reservation.js";
import Showtime from "../../models/Showtime.js";
import { AppError, NotFoundError } from "../../middlewares/errorHandler.js";

export const getAllReservations = async (req, res, next) => {
  try {
    // Build query based on filters
    const query = {};

    // Filter by date range
    if (req.query.startDate && req.query.endDate) {
      query.createdAt = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate),
      };
    }

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filter by movie
    if (req.query.movie) {
      const showtimes = await Showtime.find({ movie: req.query.movie });
      query.showtime = { $in: showtimes.map((s) => s._id) };
    }

    const reservations = await Reservation.find(query)
      .populate("user", "name email")
      .populate({
        path: "showtime",
        populate: {
          path: "movie",
          select: "title",
        },
      })
      .sort("-createdAt");

    res.status(200).json({
      status: "success",
      results: reservations.length,
      data: { reservations },
    });
  } catch (error) {
    next(new AppError("Error fetching reservations", 500));
  }
};

export const getReservationById = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate("user", "name email")
      .populate({
        path: "showtime",
        populate: {
          path: "movie",
          select: "title duration",
        },
      });

    if (!reservation) {
      return next(new NotFoundError("Reservation not found"));
    }

    res.status(200).json({
      status: "success",
      data: { reservation },
    });
  } catch (error) {
    next(new AppError("Error fetching reservation", 500));
  }
};

export const cancelReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return next(new NotFoundError("Reservation not found"));
    }

    // Update showtime seat status
    const showtime = await Showtime.findById(reservation.showtime);
    if (showtime) {
      const seat = showtime.seats.find(
        (s) => s.seatNumber === reservation.seatNumber
      );
      if (seat) {
        seat.status = "available";
        seat.reservedBy = null;
        seat.reservationTime = null;
        showtime.reservedSeats -= 1;
        showtime.availableSeats += 1;
        await showtime.save();
      }
    }

    // Delete reservation
    await reservation.deleteOne();

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(new AppError("Error canceling reservation", 500));
  }
};

export const getReservationsSummary = async (req, res, next) => {
  try {
    // Get date range from query params (default to last 30 days)
    const startDate = req.query.startDate
      ? new Date(req.query.startDate)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = req.query.endDate
      ? new Date(req.query.endDate)
      : new Date();

    const reservations = await Reservation.find({
      createdAt: { $gte: startDate, $lte: endDate },
    });

    // Calculate statistics
    const totalReservations = reservations.length;
    const totalRevenue = reservations.reduce((sum, r) => sum + r.price, 0);

    const statusCounts = reservations.reduce((acc, r) => {
      acc[r.status] = (acc[r.status] || 0) + 1;
      return acc;
    }, {});

    // Get top movies by revenue
    const movieRevenue = await Reservation.aggregate([
      {
        $match: {
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
        dateRange: { startDate, endDate },
        summary: {
          totalReservations,
          totalRevenue,
          statusCounts,
        },
        topMovies: movieRevenue,
      },
    });
  } catch (error) {
    next(new AppError("Error generating reservation summary", 500));
  }
};

export const getDailyReservations = async (req, res, next) => {
  try {
    // Get date from query params (default to today)
    const date = req.query.date ? new Date(req.query.date) : new Date();
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const reservations = await Reservation.find({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    }).populate({
      path: "showtime",
      populate: {
        path: "movie",
        select: "title",
      },
    });

    // Calculate daily statistics
    const totalReservations = reservations.length;
    const totalRevenue = reservations.reduce((sum, r) => sum + r.price, 0);

    const statusCounts = reservations.reduce((acc, r) => {
      acc[r.status] = (acc[r.status] || 0) + 1;
      return acc;
    }, {});

    // Group by showtime
    const showtimeStats = await Reservation.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfDay, $lte: endOfDay },
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
        $group: {
          _id: "$showtime._id",
          movie: { $first: "$showtime.movieTitle" },
          startTime: { $first: "$showtime.startTime" },
          reservations: { $sum: 1 },
          revenue: { $sum: "$price" },
        },
      },
      { $sort: { startTime: 1 } },
    ]);

    res.status(200).json({
      status: "success",
      data: {
        date: startOfDay,
        summary: {
          totalReservations,
          totalRevenue,
          statusCounts,
        },
        showtimeStats,
      },
    });
  } catch (error) {
    next(new AppError("Error generating daily report", 500));
  }
};
