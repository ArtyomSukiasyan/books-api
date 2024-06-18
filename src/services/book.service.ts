import { Request, Response } from "express";
import Book from "../models/Book";

async function createBook(req: Request, res: Response) {
  try {
    const { title, author, publicationDate, genres } = req.body;
    
    const newBook = new Book({ title, author, publicationDate, genres });
    const book = await newBook.save();

    return res.json(book);
  } catch (err) {
    return res.status(500).send("Server Error");
  }
}

async function getBooks(req: Request, res: Response) {
  try {
    const books = await Book.find();

    return res.json(books);
  } catch (err) {
    return res.status(500).send("Server Error");
  }
}

async function getBookById(req: Request, res: Response) {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ msg: "Book not found" });
    }

    return res.json(book);
  } catch (err) {
    return res.status(500).send("Server Error");
  }
}

async function updateBookById(req: Request, res: Response) {
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

    return res.json(book);
  } catch (err) {
    return res.status(500).send("Server Error");
  }
}

async function deleteBookById(req: Request, res: Response) {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ msg: "Book not found" });
    }
    await book.deleteOne({ _id: book._id });

    return res.json({ msg: "Book removed" });
  } catch (err) {
    return res.status(500).send("Server Error");
  }
}

export default {
  createBook,
  getBooks,
  getBookById,
  updateBookById,
  deleteBookById,
};
