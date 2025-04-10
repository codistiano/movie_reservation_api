import Reservation from "../../models/Reservation.js";
import Showtime from "../../models/Showtime.js";
import {
  AppError,
  NotFoundError,
  ValidationError,
} from "../../middlewares/errorHandler.js";

export const getUserReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find({ user: req.user._id })
      .populate({
        path: "showtime",
        populate: {
          path: "movie",
          select: "title poster",
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

export const createReservation = async (req, res, next) => {
  try {
    const { showtimeId, seatNumber } = req.body;

    if (!showtimeId || !seatNumber) {
      return next(
        new ValidationError("Showtime ID and seat number are required")
      );
    }

    // Find showtime and check seat availability
    const showtime = await Showtime.findById(showtimeId);
    if (!showtime) {
      return next(new NotFoundError("Showtime not found"));
    }

    const seat = showtime.seats.find((s) => s.seatNumber === seatNumber);
    if (!seat) {
      return next(new ValidationError("Invalid seat number"));
    }

    if (seat.status !== "available") {
      return next(new ValidationError("Seat is not available"));
    }

    // Create reservation
    const reservation = new Reservation({
      user: req.user._id,
      showtime: showtimeId,
      seatNumber,
      price: seat.price,
      status: "reserved",
    });

    // Update seat status
    seat.status = "reserved";
    seat.reservedBy = req.user._id;
    seat.reservationTime = new Date();
    showtime.reservedSeats += 1;
    showtime.availableSeats -= 1;

    await Promise.all([reservation.save(), showtime.save()]);

    res.status(201).json({
      status: "success",
      data: { reservation },
    });
  } catch (error) {
    next(new AppError("Error creating reservation", 500));
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

    if (reservation.status === "booked") {
      return next(new ValidationError("Cannot cancel a booked reservation"));
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

export const payReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!reservation) {
      return next(new NotFoundError("Reservation not found"));
    }

    if (reservation.status !== "reserved") {
      return next(new ValidationError("Only reserved seats can be paid for"));
    }

    // In a real application, we would integrate with a payment gateway here
    // For now, we'll just simulate a successful payment

    // Update reservation status
    reservation.status = "booked";
    reservation.paymentDate = new Date();

    // Update showtime seat status
    const showtime = await Showtime.findById(reservation.showtime);
    if (showtime) {
      const seat = showtime.seats.find(
        (s) => s.seatNumber === reservation.seatNumber
      );
      if (seat) {
        seat.status = "booked";
        showtime.reservedSeats -= 1;
        showtime.bookedSeats += 1;
        showtime.revenue += reservation.price;
        await showtime.save();
      }
    }

    await reservation.save();

    res.status(200).json({
      status: "success",
      data: { reservation },
    });
  } catch (error) {
    next(new AppError("Error processing payment", 500));
  }
};
