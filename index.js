import dotenv from 'dotenv';
dotenv.config();
import express, { json } from 'express';
const app = express()
const PORT = process.env.PORT || 5000;

// Routes Importing
import authRoutes from './routes/authRoutes.js';

// Importing Admin Routes
import movieRoutes from "./routes/admin/moviesRoutes.js"
// import reservationsRoutes from "./routes/admin/reservationsRoutes.js"
import showtimeRoutes from "./routes/admin/showtimeRoutes.js"
import userRoutes from "./routes/admin/userRoutes.js"

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
app.use('/api/admin/users', userRoutes);
// app.use('/api/admin/reservations', reservationsRoutes);
app.use('/api/admin/movies', movieRoutes);
app.use('/api/admin/showtimes', showtimeRoutes)


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


