import { Router } from "express";
const router = Router();
import auth from "../../middlewares/auth.js";
const { isLoggedIn, isAdmin } = auth;
import { createShowtime, updateShowtime, deleteShowtime, getAllShowtimes } from '../../controllers/admin/showtimesController.js';

// Importing Models for testing

// All routes are protected for admins only
router.use(isLoggedIn, isAdmin);

router.get("/", getAllShowtimes);

router.post("/", createShowtime); 

router.put('/:id', updateShowtime);

router.delete('/:id', deleteShowtime);        

export default router;
