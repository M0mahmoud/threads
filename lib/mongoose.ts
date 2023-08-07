import { connect, set } from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  set("strictQuery", true);

  if (!process.env.DATABASE_URL) return console.log("Database not specified");

  if (isConnected) return console.log("Already Connecting to database");

  try {
    await connect(process.env.DATABASE_URL);
    isConnected = true;
    console.log("Connected");
  } catch (e) {
    console.log("e:", e);
  }
};
