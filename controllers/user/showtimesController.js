import Showtime from "../../models/Showtime.js";

export const getAllShowtimes = async (req, res) => {
  try {
    const allShowtimes = await Showtime.find().select("-seats");
    const now = new Date();
    const filtered = allShowtimes.filter((show) => {
      const [h, m] = show.startTime.split(":").map(Number);
      const dt = new Date(show.date);
      dt.setHours(h, m, 0, 0);
      return dt > now;
    });
    res.status(200).json(filtered);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getShowtimeById = async (req, res) => {
  try {
    const showtime = await Showtime.findById(req.params.id);
    if (!showtime) {
      return res.status(404).json({ message: "Showtime not found" });
    }
    res.status(200).json(showtime);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const reserveaSeat = async (req, res) => {
  try {
    const { row, seatNumber } = req.body;
    const userId = req.user._id;
    const pricePerSeat = 100;

    // Build query to find and update in one go
    const query = {
      _id: req.params.id,
      [`seats.${row}`]: { $elemMatch: { seatNumber, isReserved: false } },
    };

    const update = {
      $set: {
        [`seats.${row}.$[elem].isReserved`]: true,
        [`seats.${row}.$[elem].reservedBy`]: userId,
      },
      $inc: {
        seatsReservedCount: 1,
        seatsAvailableCount: -1,
        revenue: pricePerSeat,
      },
    };

    const options = {
      new: true,
      arrayFilters: [{ "elem.seatNumber": seatNumber }],
    };

    const updatedShowtime = await Showtime.findOneAndUpdate(
      query,
      update,
      options
    );

    if (!updatedShowtime) {
      return res
        .status(400)
        .json({ message: "Seat already reserved or not found" });
    }

    res.status(200).json({ message: "Seat reserved successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const cancelReservation = async (req, res) => {
  try {
    const { row, seatNumber } = req.body;
    const userId = req.user.userId;
    const pricePerSeat = 100;

    const query = {
      _id: req.params.id,
      [`seats.${row}`]: {
        $elemMatch: { seatNumber, isReserved: true, reservedBy: userId },
      },
    };

    const update = {
      $set: {
        [`seats.${row}.$[elem].isReserved`]: false,
        [`seats.${row}.$[elem].reservedBy`]: null,
      },
      $inc: {
        seatsReservedCount: -1,
        seatsAvailableCount: 1,
        revenue: -pricePerSeat,
      },
    };

    const options = {
      new: true,
      arrayFilters: [{ "elem.seatNumber": seatNumber }],
    };

    const updatedShowtime = await Showtime.findOneAndUpdate(
      query,
      update,
      options
    );

    if (!updatedShowtime) {
      return res
        .status(400)
        .json({ message: "Seat not reserved by you or doesn't exist" });
    }

    res.status(200).json({ message: "Reservation cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
