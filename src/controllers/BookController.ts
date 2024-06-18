import { Request, Response } from "express";
import bookService from "../services/book.service";

export async function createBook(req: Request, res: Response) {
  return bookService.createBook(req, res);
}

export async function getBooks(req: Request, res: Response) {
  return bookService.getBooks(req, res);
}

export async function getBookById(req: Request, res: Response) {
  return bookService.getBookById(req, res);
}

export async function updateBookById(req: Request, res: Response) {
  return bookService.updateBookById(req, res);
}

export async function deleteBookById(req: Request, res: Response) {
  return bookService.deleteBookById(req, res);
}
