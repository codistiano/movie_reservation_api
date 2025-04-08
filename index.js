import dotenv from 'dotenv';
dotenv.config();
import express, { json } from 'express';
const app = express()
const PORT = process.env.PORT || 5000;

// Routes Importing
import authRoutes from './routes/authRoutes.js';

// Importing Admin Routes
import adminMovieRoutes from "./routes/admin/moviesRoutes.js"
import adminReservationRoutes from "./routes/admin/reservationsRoutes.js"
import adminShowtimeRoutes from "./routes/admin/showtimeRoutes.js"
import adminUserRoutes from "./routes/admin/userRoutes.js"
import reportsRoutes from "./routes/admin/reportsRoutes.js"

// Importing User Routes
// import userMovieRoutes from "./routes/user/moviesRoutes.js"
// import userReservationRoutes from "./routes/user/reservationsRoutes.js"
import showtimeRoutes from "./routes/user/showtimeRoutes.js"
// import userProfileRoutes from "./routes/user/profileRoutes.js"

// importing mongoose config from db.js
import db from './config/db.js';

// Connecting to the database
db.connect(process.env.DB_URI || 'mongodb://localhost/movie_reservation_api');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Movie Reservation System is running!');
});

app.use('/api/auth', authRoutes);

// Admin routes
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/admin/reservations', adminReservationRoutes);
app.use('/api/admin/movies', adminMovieRoutes);
app.use('/api/admin/showtimes', adminShowtimeRoutes)
app.use('/api/admin/reports', reportsRoutes)

// User routes
app.use('/api/showtimes', showtimeRoutes)


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


