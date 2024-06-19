import express from "express";
import auth from "../middlewares/auth";
import {
  createBook,
  deleteBookById,
  getBookById,
  getBooks,
  updateBookById,
} from "../controllers/BookController";
import { admin } from "../middlewares/roles";

const router = express.Router();

router.post("/", auth, admin, createBook);
router.get("/", getBooks);
router.get("/:id", getBookById);
router.put("/:id", auth, admin, updateBookById);
router.delete("/:id", auth, admin, deleteBookById);

export default router;
