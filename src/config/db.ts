import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI as string);
    console.log(`Database Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;
