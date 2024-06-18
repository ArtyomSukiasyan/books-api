import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect("mongodb://localhost:27017/bookstore");
    console.log("MongoDB connected...");
  } catch (err) {
    console.error((err as Error).message);
    process.exit(1);
  }
};

export default connectDB;