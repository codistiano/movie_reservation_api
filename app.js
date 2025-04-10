import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { specs } from "./src/config/swagger.js";
import swaggerUi from "swagger-ui-express";
import healthRoutes from "./src/routes/healthRoutes.js";

// Import routes
import authRoutes from "./src/routes/authRoutes.js";

// Admin Routes
import adminMovieRoutes from "./src/routes/admin/moviesRoutes.js";
import adminReservationRoutes from "./src/routes/admin/reservationsRoutes.js";
import adminShowtimeRoutes from "./src/routes/admin/showtimeRoutes.js";
import adminUserRoutes from "./src/routes/admin/userRoutes.js";
import reportsRoutes from "./src/routes/admin/reportsRoutes.js";

// User Routes
import userMovieRoutes from "./src/routes/user/moviesRoutes.js";
import userReservationRoutes from "./src/routes/user/reservationsRoutes.js";
import userShowtimeRoutes from "./src/routes/user/showtimeRoutes.js";
import userProfileRoutes from "./src/routes/user/profileRoutes.js";

// Import error handling middleware
import { errorHandler } from "./src/middlewares/errorHandler.js";

const app = express();

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

app.get("/", async (req, res) => {
  res.send("Nothing to look at here!");
});

// API Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Health check route
app.use("/api/health", healthRoutes);

// Routes
app.use("/api/auth", authRoutes);

// Admin routes
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin/reservations", adminReservationRoutes);
app.use("/api/admin/movies", adminMovieRoutes);
app.use("/api/admin/showtimes", adminShowtimeRoutes);
app.use("/api/admin/reports", reportsRoutes);

// User routes
app.use("/api/movies", userMovieRoutes);
app.use("/api/reservations", userReservationRoutes);
app.use("/api/showtimes", userShowtimeRoutes);
app.use("/api/profile", userProfileRoutes);

// Handle unhandled routes
app.use((req, res) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

// Error handling middleware (should be last)
app.use(errorHandler);

export default app;
