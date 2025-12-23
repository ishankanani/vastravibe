import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";

import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import inquiryRouter from "./routes/inquiryRoute.js";

/* -------------------------------------------------------------------------- */
/* 🔹 ENV SETUP */
/* -------------------------------------------------------------------------- */
dotenv.config();

/* -------------------------------------------------------------------------- */
/* 🔹 APP INIT */
/* -------------------------------------------------------------------------- */
const app = express();
const PORT = process.env.PORT || 5000;

/* -------------------------------------------------------------------------- */
/* 🔹 CONNECT SERVICES (RUN ONCE) */
/* -------------------------------------------------------------------------- */
connectDB();           // MongoDB (cached connection)
connectCloudinary();   // Cloudinary

/* -------------------------------------------------------------------------- */
/* 🔹 MIDDLEWARES */
/* -------------------------------------------------------------------------- */
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json({ limit: "10mb" }));

/* -------------------------------------------------------------------------- */
/* 🔹 HEALTH CHECK (KEEP RENDER AWAKE) */
/* -------------------------------------------------------------------------- */
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

/* -------------------------------------------------------------------------- */
/* 🔹 API ROUTES */
/* -------------------------------------------------------------------------- */
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/inquiry", inquiryRouter);

/* -------------------------------------------------------------------------- */
/* 🔹 ROOT ROUTE */
/* -------------------------------------------------------------------------- */
app.get("/", (req, res) => {
  res.send("API Working");
});

/* -------------------------------------------------------------------------- */
/* 🔹 START SERVER */
/* -------------------------------------------------------------------------- */
app.listen(PORT, () => {
  console.log(`🚀 Server started on PORT: ${PORT}`);
});
