import express from "express";
import connectDB from "./config/db";
import usersRoutes from "./routes/users";
import booksRoutes from "./routes/books";

const app = express();
connectDB();

app.use(express.json());
app.use("/users", usersRoutes);
app.use("/books", booksRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
