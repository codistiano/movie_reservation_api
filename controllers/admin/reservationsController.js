import Reservation from '../../models/Reservation.js';

export const getAllReservations = async (req, res) => {  // Get all reservations
    try {
        const reservations = await Reservation.find({});
        res.status(200).json(reservations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getReservationById = async (req, res) => {   // Get reservation by ID
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }
        res.status(200).json(reservation);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}