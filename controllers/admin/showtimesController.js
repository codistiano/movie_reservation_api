import Showtime from "../../models/Showtime.js";
import Movie from "../../models/Movie.js";

// Controllers for showtime Routes
export const getAllShowtimes = async (req, res) => {
  try {
    const showtimes = await Showtime.find({});
    res.status(200).json(showtimes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createShowtime = async (req, res) => {
  // Creates a new Show Time for a movie
  try {
    const { movie, date, startTime } = req.body;

    if (!movie || !date || !startTime) {
      return res
        .status(400)
        .json({ error: "movie, date, and startTime are required" });
    }
    // Fetch movie by ID to get the duration
    const movieData = await Movie.findById(movie);
    if (!movieData) {
      return res.status(404).json({ message: "Movie not found!" });
    }

    // Calculate endTime based on startTime and movie duration
    const durationInMilliseconds = movieData.duration * 60 * 1000;

    // The startTime format we get from the req.body is HH:MM format
    // We need to convert it to a Date object for comparison
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const convertedStartTime = new Date(date);
    convertedStartTime.setHours(startHour, startMinute, 0, 0); // Sets hours and minutes, and ensure seconds and milliseconds are 0

    // Calculate the endTime from the startTime and duration
    const convertedEndTime = new Date(
      convertedStartTime.getTime() + durationInMilliseconds
    );

    // The endTime format we need is HH:MM
    const endHour = String(convertedEndTime.getHours()).padStart(2, "0");
    const endMinute = String(convertedEndTime.getMinutes()).padStart(2, "0");
    const endTime = `${endHour}:${endMinute}`;

    // Find existing showtimes on the same date
    const existingShowtimes = await Showtime.find({ date });

    // Check for overlapping showtimes
    if (existingShowtimes) {
      for (const showtime of existingShowtimes) {
        const [eHour, eMinute] = showtime.startTime.split(":").map(Number);
        const existingStartTime = new Date(date);
        existingStartTime.setHours(eHour, eMinute, 0, 0); // Sets hours and minutes, and ensure seconds and milliseconds are 0

        const [eEndHour, eEndMinute] = showtime.endTime.split(":").map(Number);
        const existingEndTime = new Date(date);
        existingEndTime.setHours(eEndHour, eEndMinute, 0, 0); // Sets hours and minutes, and ensure seconds and milliseconds are 0

        if (
          (convertedStartTime < existingEndTime &&
            convertedEndTime > existingStartTime) ||
          (convertedStartTime >= existingStartTime &&
            convertedStartTime < existingEndTime) ||
          (convertedEndTime > existingStartTime &&
            convertedEndTime <= existingEndTime) ||
          (convertedStartTime <= existingStartTime &&
            convertedEndTime >= existingEndTime)
        ) {
          showtime.movie = await Movie.findById(showtime.movie);
          return res.status(400).json({
            Error: "Overlapping showtime detected",
            overlappingShowtime: {
              movie: showtime.movie.title,
              date: showtime.date,
              startTime: showtime.startTime,
              endTime: showtime.endTime,
            },
          });
        }
      }
    }

    const movieT = await Movie.findById(movie);

    // No overlap found, create the new showtime
    const newShowtime = new Showtime({
      movie,
      movieTitle: movieT.title,
      date,
      startTime,
      endTime,
      seatsCapacity: 30, // Default value
      seatsReservedCount: 0,
      seatsAvailableCount: 30,
      revenue: 0,
    });

    await newShowtime.save();
    res.status(201).json(newShowtime);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

export const updateShowtime = async (req, res) => {
  // Update showtime
  const { id } = req.params;
  if (!req.body) {
    return res.status(400).json({ message: "No data provided" });
  }
  try {
    const showtime = await Showtime.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!showtime) {
      return res.status(404).json({ message: "Showtime not found" });
    }
    res.status(200).json(showtime);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteShowtime = async (req, res) => {
  // Delete showtime
  const { id } = req.params;
  try {
    const showtime = await Showtime.findByIdAndDelete(id);
    if (!showtime) {
      return res.status(404).json({ message: "Showtime not found" });
    }
    res.status(200).json({ message: "Showtime deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
