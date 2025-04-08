function generateSeats(rows = ['A', 'B', 'C'], seatsPerRow = 10) {
    const seatMap = new Map();
  
    rows.forEach(row => {
      const rowSeats = [];
      for (let i = 1; i <= seatsPerRow; i++) {
        rowSeats.push({
          seatNumber: `${row}${i}`,
          isReserved: false,
          reservedBy: null
        });
      }
      seatMap.set(row, rowSeats);
    });
  
    return seatMap;
  }
  
export default generateSeats;