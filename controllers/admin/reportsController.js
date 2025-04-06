import Showtime from "../../models/Showtime.js";
import Movie from "../../models/Movie.js";
import User from "../../models/User.js";

export const getTotalReport = async (req, res) => {
  try {
    const showtimes = await Showtime.find({});
    const totalUsers = await User.countDocuments();
    const totalMovies = await Movie.countDocuments();

    let revenue = 0;
    showtimes.forEach((showtime) => {
      console.log(typeof showtime.revenue);
      console.log("Before: ", revenue);
      revenue += showtime.revenue;
      console.log("After: ", revenue);
    });

    return res.status(200).json({ revenue, totalUsers, totalMovies });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getShowtimeReport = async (req, res) => {
  try {
    const showtime = await Showtime.findById(req.params.id);
    if (!showtime) {
      return res.status(404).json({ message: "Showtime not found" });
    }
    const movie = await Movie.findById(showtime.movie);

    // Filtered Reserved Seats
    const reservedSeats = showtime.seats.filter(
      (seat) => seat.isReserved === true
    );

    // Filtered Available Seats
    const availableSeats = showtime.seats.filter(
      (seat) => seat.isReserved === False
    );

    const report = {
      movie: movie.title,
      showtime: showtime.showtime,
      showtimeRevenue: showtime.revenue,
      seatsCapacity: showtime.seatsCapacity,
      seatsAvailable: showtime.seatsAvailableCount,
      seatsReserved: showtime.seatsReservedCount,
      seatsReservedList: reservedSeats.map((seat) => seat.seatNumber),
      seatsAvailableList: reservedSeats.map((seat) => seat.seatNumber),
    };
    return res.status(200).json(report);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
