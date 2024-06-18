import express from "express";
import connectDB from "./config/db";
import usersRoutes from "./routes/users";

const app = express();
connectDB();

app.use(express.json());
app.use("/users", usersRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
