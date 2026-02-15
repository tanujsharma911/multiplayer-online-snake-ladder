import mongoose from "mongoose";
import dotenv from "dotenv";
import { DB_NAME } from "../contants.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONOGODB_URL + `/${DB_NAME}`);
    console.log("\x1b[32m%s\x1b[0m", "\n💾  Connected to MongoDB :: Database");
  } catch (err) {
    console.log("\x1b[31m%s\x1b[0m", "Error connecting to MongoDB:", err);
    process.exit(1);
  }
};

export default connectDB;
