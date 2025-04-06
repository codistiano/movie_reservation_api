import { Router } from 'express';
const router = Router();
import auth from '../../middlewares/auth.js';
const { isLoggedIn, isAdmin } = auth;
import { getAllMovies, createMovie, updateMovie, deleteMovie } from '../../controllers/admin/moviesController.js';

// All routes are protected for admins only
router.use(isLoggedIn, isAdmin);

router.get('/', getAllMovies);      // Get All Movies           

router.post('/', createMovie);      // Create new movie

router.put('/:id',updateMovie);         // Update movie

router.delete('/:id', deleteMovie);         // Delete movie

export default router;
