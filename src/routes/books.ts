import express, { Request, Response } from "express";
import Book from "../models/Book";
import auth from "../middlewares/auth";

const router = express.Router();

router.post("/", auth, async (req: Request, res: Response) => {
  const { title, author, publicationDate, genres } = req.body;
  try {
    const newBook = new Book({ title, author, publicationDate, genres });
    const book = await newBook.save();
    res.json(book);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ msg: "Book not found" });
    }
    res.json(book);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

router.put("/:id", auth, async (req: Request, res: Response) => {
  const { title, author, publicationDate, genres } = req.body;
  try {
    let book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ msg: "Book not found" });
    }
    book.title = title;
    book.author = author;
    book.publicationDate = publicationDate;
    book.genres = genres;
    book = await book.save();
    res.json(book);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

router.delete("/:id", auth, async (req: Request, res: Response) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ msg: "Book not found" });
    }
    await book.deleteOne({ _id: book._id });
    res.json({ msg: "Book removed" });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

export default router;
