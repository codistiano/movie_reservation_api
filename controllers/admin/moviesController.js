// Controllers for admin movies routes

import Movie from '../../models/Movie.js';

export const getAllMovies = async (req, res) => { // View all movies 
    try {
        const movies = await Movie.find({});
        res.status(200).json(movies);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const createMovie = async (req, res) => { // Create a new movie 
    try {
        const movie = new Movie(req.body);
        await movie.save();
        res.status(201).json({message: 'Movie added successfully', movie});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const updateMovie = async (req, res) => { // Update a movie 
    try {
        const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.status(200).json({ message: 'Movie updated successfully', movie });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const deleteMovie = async (req, res) => { // Delete a movie 
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.status(200).json({ message: 'Movie deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
