const generateSeats = (rows = 10, seatsPerRow = 15) => {
  const seats = [];
  const rowLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  // Different price tiers based on row
  const priceTiers = {
    A: 200, // Front row
    B: 200,
    C: 160,
    D: 160,
    E: 140,
    F: 140, // Middle rows
    G: 100,
    H: 100,
    I: 100,
    J: 100,
    K: 80, // Back rows
    L: 80,
    M: 50,
    N: 50,
    O: 50,
  };

  for (let row = 0; row < rows; row++) {
    const rowLetter = rowLetters[row];
    for (let seatNum = 1; seatNum <= seatsPerRow; seatNum++) {
      seats.push({
        seatNumber: `${rowLetter}${seatNum}`,
        row: rowLetter,
        number: seatNum,
        status: "available",
        price: priceTiers[rowLetter] || 10, // Default price if row not in tiers
        reservedBy: null,
        reservationTime: null,
      });
    }
  }

  return seats;
};

export default generateSeats;
