import express from "express";
import auth from "../middlewares/auth";
import {
  createBook,
  deleteBookById,
  getBookById,
  getBooks,
  updateBookById,
} from "../controllers/BookController";

const router = express.Router();

router.post("/", auth, createBook);
router.get("/", getBooks);
router.get("/:id", getBookById);
router.put("/:id", auth, updateBookById);
router.delete("/:id", auth, deleteBookById);

export default router;
