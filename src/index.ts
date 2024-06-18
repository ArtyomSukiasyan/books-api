import express from "express";
import connectDB from "./config/db";

const app = express();
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
