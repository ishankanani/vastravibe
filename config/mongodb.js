import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/e-commerce`, {
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = true;
    console.log("DB Connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

export default connectDB;
