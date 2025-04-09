import dotenv from "dotenv";
dotenv.config();
import express, { json } from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes Importing
import authRoutes from "./routes/authRoutes.js";

// Importing Admin Routes
import adminMovieRoutes from "./routes/admin/moviesRoutes.js";
import adminReservationRoutes from "./routes/admin/reservationsRoutes.js";
import adminShowtimeRoutes from "./routes/admin/showtimeRoutes.js";
import adminUserRoutes from "./routes/admin/userRoutes.js";
import reportsRoutes from "./routes/admin/reportsRoutes.js";

// Importing User Routes
// import userMovieRoutes from "./routes/user/moviesRoutes.js"
// import userReservationRoutes from "./routes/user/reservationsRoutes.js"
import showtimeRoutes from "./routes/user/showtimeRoutes.js";
// import userProfileRoutes from "./routes/user/profileRoutes.js"

// importing mongoose config from db.js
import db from "./config/db.js";

// Connecting to the database
db.connect(process.env.DB_URI || "mongodb://localhost/movie_reservation_api");

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/auth", authRoutes);

// Admin routes
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin/reservations", adminReservationRoutes);
app.use("/api/admin/movies", adminMovieRoutes);
app.use("/api/admin/showtimes", adminShowtimeRoutes);
app.use("/api/admin/reports", reportsRoutes);

// User routes
app.use("/api/showtimes", showtimeRoutes);

// Error handling middleware (should be last)
app.use(errorHandler);

// Handle unhandled routes
app.use((req, res) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
