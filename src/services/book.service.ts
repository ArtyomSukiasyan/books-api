import { Request, Response } from "express";
import { errorMessages } from "../constants/errorMessages";
import Book from "../models/Book";

async function createBook(req: Request, res: Response) {
  try {
    const { title, author, publicationDate, genres } = req.body;

    const newBook = new Book({ title, author, publicationDate, genres });
    const book = await newBook.save();

    return res.json(book);
  } catch (err) {
    console.log(err);

    return res.status(500).send(errorMessages.serverError);
  }
}

async function getBooks(req: Request, res: Response) {
  try {
    const books = await Book.find();

    return res.json(books);
  } catch (err) {
    console.log(err);

    return res.status(500).send(errorMessages.serverError);
  }
}

async function getBookById(req: Request, res: Response) {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ msg: errorMessages.notFound("Book") });
    }

    return res.json(book);
  } catch (err) {
    console.log(err);

    return res.status(500).send(errorMessages.serverError);
  }
}

async function updateBookById(req: Request, res: Response) {
  const { title, author, publicationDate, genres } = req.body;
  try {
    let book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ msg: errorMessages.notFound("Book") });
    }
    book.title = title;
    book.author = author;
    book.publicationDate = publicationDate;
    book.genres = genres;
    book = await book.save();

    return res.json(book);
  } catch (err) {
    console.log(err);

    return res.status(500).send(errorMessages.serverError);
  }
}

async function deleteBookById(req: Request, res: Response) {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ msg: errorMessages.notFound("Book") });
    }
    await book.deleteOne({ _id: book._id });

    return res.json({ msg: errorMessages.bookRemoved });
  } catch (err) {
    console.log(err);

    return res.status(500).send(errorMessages.serverError);
  }
}

export default {
  createBook,
  getBooks,
  getBookById,
  updateBookById,
  deleteBookById,
};
