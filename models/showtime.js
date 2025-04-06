import { Schema, model } from 'mongoose';

const seatSchema = new Schema({
  seatNumber: String,
  isReserved: { type: Boolean, default: false },
  reservedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null }
});

const showtimeSchema = new Schema({
  movie: {
    type: Schema.Types.ObjectId,
    ref: 'Movie',
    required: true,
  },
  movieTitle: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  seats: [seatSchema],

  // For analytics — optional optimization
  seatsCapacity: Number,         // total number of seats
  seatsReservedCount: Number,    // updated when someone reserves
  seatsAvailableCount: Number,   // updated when someone cancels reservation
  revenue: Number                // updated when reservation happens
}, { timestamps: true });

export default model('Showtime', showtimeSchema);
