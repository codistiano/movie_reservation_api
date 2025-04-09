import Showtime from "../../models/Showtime.js";
import Reservation from "../../models/Reservation.js";
import {
  AppError,
  NotFoundError,
  ValidationError,
} from "../../middlewares/errorHandler.js";

export const getAllShowtimes = async (req, res, next) => {
  try {
    const showtimes = await Showtime.find({})
      .populate("movie", "title duration poster")
      .select("-seats")
      .sort({ date: 1, startTime: 1 });

    res.status(200).json({
      status: "success",
      results: showtimes.length,
      data: { showtimes },
    });
  } catch (error) {
    next(new AppError("Error fetching showtimes", 500));
  }
};

export const getShowtimeById = async (req, res, next) => {
  try {
    const showtime = await Showtime.findById(req.params.id)
      .populate("movie", "title duration poster")
      .select("-seats");

    if (!showtime) {
      return next(new NotFoundError("Showtime not found"));
    }

    res.status(200).json({
      status: "success",
      data: { showtime },
    });
  } catch (error) {
    next(new AppError("Error fetching showtime", 500));
  }
};

export const reserveSeat = async (req, res, next) => {
  try {
    const { showtimeId, seatNumber } = req.body;

    if (!showtimeId || !seatNumber) {
      return next(
        new ValidationError("Showtime ID and seat number are required")
      );
    }

    const showtime = await Showtime.findById(showtimeId);
    if (!showtime) {
      return next(new NotFoundError("Showtime not found"));
    }

    // Check if seat is available
    const seat = showtime.seats.find((s) => s.number === seatNumber);
    if (!seat) {
      return next(new ValidationError("Invalid seat number"));
    }
    if (seat.status !== "available") {
      return next(new ValidationError("Seat is already reserved or booked"));
    }

    // Create reservation
    const reservation = new Reservation({
      user: req.user._id,
      showtime: showtimeId,
      seatNumber,
      status: "reserved",
    });

    // Update seat status
    seat.status = "reserved";
    await showtime.save();
    await reservation.save();

    res.status(201).json({
      status: "success",
      data: { reservation },
    });
  } catch (error) {
    next(new AppError("Error reserving seat", 500));
  }
};

export const cancelReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!reservation) {
      return next(new NotFoundError("Reservation not found"));
    }

    const showtime = await Showtime.findById(reservation.showtime);
    if (!showtime) {
      return next(new NotFoundError("Showtime not found"));
    }

    // Update seat status
    const seat = showtime.seats.find(
      (s) => s.number === reservation.seatNumber
    );
    if (seat) {
      seat.status = "available";
      await showtime.save();
    }

    await reservation.deleteOne();

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(new AppError("Error canceling reservation", 500));
  }
};
