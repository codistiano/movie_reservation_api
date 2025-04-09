import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";
import Movie from "./models/Movie.js";
import Showtime from "./models/Showtime.js";
import Reservation from "./models/Reservation.js";

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/movie_reservation";

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Movie.deleteMany({});
    await Showtime.deleteMany({});
    await Reservation.deleteMany({});
    console.log("Cleared existing data");

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 12);
    const admin = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
      phone: "1234567890",
    });
    console.log("Created admin user");

    // Create regular user
    const userPassword = await bcrypt.hash("user123", 12);
    const user = await User.create({
      name: "Regular User",
      email: "user@example.com",
      password: userPassword,
      role: "user",
      phone: "0987654321",
    });
    console.log("Created regular user");

    // Create movies
    const movie1 = await Movie.create({
      title: "The Dark Knight",
      description:
        "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
      genre: "Action",
      duration: 152,
      poster: "https://example.com/dark-knight-poster.jpg",
    });

    const movie2 = await Movie.create({
      title: "Inception",
      description:
        "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
      genre: "Sci-Fi",
      duration: 148,
      poster: "https://example.com/inception-poster.jpg",
    });
    console.log("Created movies");

    // Create showtimes with proper seat structure
    const showtime1 = await Showtime.create({
      movie: movie1._id,
      movieTitle: movie1.title,
      date: "2024-03-20",
      startTime: "18:00",
      endTime: "20:32",
      seats: [
        {
          seatNumber: "A1",
          row: "A",
          number: 1,
          status: "available",
          price: 12.99,
        },
        {
          seatNumber: "A2",
          row: "A",
          number: 2,
          status: "available",
          price: 12.99,
        },
        {
          seatNumber: "A3",
          row: "A",
          number: 3,
          status: "available",
          price: 12.99,
        },
      ],
      seatLayout: {
        rows: 3,
        seatsPerRow: 3,
      },
      totalSeats: 9,
      availableSeats: 9,
      reservedSeats: 0,
      bookedSeats: 0,
      revenue: 0,
    });

    const showtime2 = await Showtime.create({
      movie: movie2._id,
      movieTitle: movie2.title,
      date: "2024-03-20",
      startTime: "19:00",
      endTime: "21:28",
      seats: [
        {
          seatNumber: "A1",
          row: "A",
          number: 1,
          status: "available",
          price: 14.99,
        },
        {
          seatNumber: "A2",
          row: "A",
          number: 2,
          status: "available",
          price: 14.99,
        },
        {
          seatNumber: "A3",
          row: "A",
          number: 3,
          status: "available",
          price: 14.99,
        },
      ],
      seatLayout: {
        rows: 3,
        seatsPerRow: 3,
      },
      totalSeats: 9,
      availableSeats: 9,
      reservedSeats: 0,
      bookedSeats: 0,
      revenue: 0,
    });
    console.log("Created showtimes");

    // Create reservation
    const reservation = await Reservation.create({
      user: user._id,
      showtime: showtime1._id,
      seats: ["A1", "A2"],
      totalPrice: 25.98,
      status: "active",
    });
    console.log("Created reservation");

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
