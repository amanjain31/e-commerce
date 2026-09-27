import mongoose from "mongoose";
import config from "./config.js";

const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log(`database is connected successfully 🛢️`);
  } catch (error) {
    console.error(`database connection failed: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
