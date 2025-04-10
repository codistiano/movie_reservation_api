import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  showtime: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Showtime',
    required: true,
  },
  seats: [String], // e.g. ['A1', 'A2']
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'cancelled'],
    default: 'active',
  }
});

const Reservation = mongoose.model('Reservation', reservationSchema);
export default Reservation;
