import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";

import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import inquiryRouter from "./routes/inquiryRoute.js";

// Load environment variables
dotenv.config();

// App configuration
const app = express();
const port = process.env.PORT || 5000;

// Connect to services
connectDB();           // MongoDB
connectCloudinary();   // Cloudinary

// Middlewares
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/inquiry", inquiryRouter);

// Default route
app.get("/", (req, res) => {
  res.send("API Working");
});

// Start server
app.listen(port, () => {
  console.log("Server started on PORT:", port);
});