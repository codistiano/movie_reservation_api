import { Schema, model } from 'mongoose';

const showtimeSchema = new Schema({
  movie: {
    type: Schema.Types.ObjectId,
    ref: 'Movie',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  seats: [
    {
      seatNumber: String,
      isReserved: {
        type: Boolean,
        default: false,
      },
      reservedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null,
      }
    }
  ],
}, { timestamps: true });

export default model('Showtime', showtimeSchema);
