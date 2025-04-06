import mongoose from "mongoose";

mongoose.connection.on("connected", () => {
  console.log("Connected To Database");
});

mongoose.connection.on("error", (err) => {
  console.log("Database connection error!");
});

mongoose.connection.on("disconnected", () => {
  console.log("Database disconnected!");
});

export default mongoose;