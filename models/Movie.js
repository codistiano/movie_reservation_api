import { Schema, model } from 'mongoose';

const movieSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  poster: String,
  genre: {
    type: String,
    required: true,
  },
  showtimes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Showtime',
    },
  ],
}, { timestamps: true });

export default model('Movie', movieSchema);
