import mongoose from "mongoose";
import createAdmin from "../migrations/createAdmin";

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected...");
    await createAdmin();
  } catch (err) {
    console.error((err as Error).message);
    process.exit(1);
  }
};

export default connectDB;
