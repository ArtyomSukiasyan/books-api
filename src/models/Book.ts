import mongoose, { Schema, Document } from "mongoose";

interface IBook extends Document {
  title: string;
  author: string;
  publicationDate: Date;
  genres: string[];
}

const BookSchema: Schema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  publicationDate: { type: Date, required: true },
  genres: { type: [String], required: true },
});

export default mongoose.model<IBook>("Book", BookSchema);
