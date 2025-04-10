import { Schema, model } from "mongoose";

const seatSchema = new Schema({
  seatNumber: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        // Format: A1, B2, C3, etc.
        return /^[A-Z]\d+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid seat number!`,
    },
  },
  row: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^[A-Z]$/.test(v);
      },
      message: (props) => `${props.value} is not a valid row!`,
    },
  },
  number: {
    type: Number,
    required: true,
    min: 1,
  },
  status: {
    type: String,
    enum: ["available", "reserved", "booked"],
    default: "available",
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  reservedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  reservationTime: {
    type: Date,
    default: null,
  },
});

const showtimeSchema = new Schema(
  {
    movie: {
      type: Schema.Types.ObjectId,
      ref: "Movie",
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
    seatLayout: {
      rows: {
        type: Number,
        required: true,
        min: 1,
      },
      seatsPerRow: {
        type: Number,
        required: true,
        min: 1,
      },
    },
    // Analytics fields
    totalSeats: {
      type: Number,
      required: true,
    },
    availableSeats: {
      type: Number,
      required: true,
    },
    reservedSeats: {
      type: Number,
      default: 0,
    },
    bookedSeats: {
      type: Number,
      default: 0,
    },
    revenue: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for seat map
showtimeSchema.virtual("seatMap").get(function () {
  if (!this.seats) {
    return null; // Return null if seats are not loaded
  }
  const map = {};
  this.seats.forEach((seat) => {
    if (!map[seat.row]) {
      map[seat.row] = {};
    }
    map[seat.row][seat.number] = {
      status: seat.status,
      price: seat.price,
      seatNumber: seat.seatNumber,
    };
  });
  return map;
});

// Method to get available seats
showtimeSchema.methods.getAvailableSeats = function () {
  return this.seats.filter((seat) => seat.status === "available");
};

// Method to get reserved seats
showtimeSchema.methods.getReservedSeats = function () {
  return this.seats.filter((seat) => seat.status === "reserved");
};

// Method to get booked seats
showtimeSchema.methods.getBookedSeats = function () {
  return this.seats.filter((seat) => seat.status === "booked");
};

// Method to reserve a seat
showtimeSchema.methods.reserveSeat = async function (seatNumber, userId) {
  const seat = this.seats.find((s) => s.seatNumber === seatNumber);
  if (!seat) {
    throw new Error("Seat not found");
  }
  if (seat.status !== "available") {
    throw new Error("Seat is not available");
  }

  seat.status = "reserved";
  seat.reservedBy = userId;
  seat.reservationTime = new Date();
  this.reservedSeats += 1;
  this.availableSeats -= 1;

  await this.save();
  return seat;
};

// Method to book a seat
showtimeSchema.methods.bookSeat = async function (seatNumber) {
  const seat = this.seats.find((s) => s.seatNumber === seatNumber);
  if (!seat) {
    throw new Error("Seat not found");
  }
  if (seat.status !== "reserved") {
    throw new Error("Seat is not reserved");
  }

  seat.status = "booked";
  this.bookedSeats += 1;
  this.reservedSeats -= 1;
  this.revenue += seat.price;

  await this.save();
  return seat;
};

// Method to cancel reservation
showtimeSchema.methods.cancelReservation = async function (seatNumber) {
  const seat = this.seats.find((s) => s.seatNumber === seatNumber);
  if (!seat) {
    throw new Error("Seat not found");
  }
  if (seat.status !== "reserved") {
    throw new Error("Seat is not reserved");
  }

  seat.status = "available";
  seat.reservedBy = null;
  seat.reservationTime = null;
  this.reservedSeats -= 1;
  this.availableSeats += 1;

  await this.save();
  return seat;
};

export default model("Showtime", showtimeSchema);
